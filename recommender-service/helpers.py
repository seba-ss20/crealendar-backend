import matplotlib.pyplot as plt
import seaborn as sb
import pandas as pd
import numpy as np
from pandas.io.json import json_normalize
import json
import pymongo
import pprint
from pymongo import MongoClient
import collections

# Calculating the cosine similarity index
# High -> closer
from sklearn.metrics.pairwise import cosine_similarity

# Creating a MongoDB connection client...

client = MongoClient('mongodb://localhost:27017')

db = client.crealender_recommender

con_check = str(db)

if con_check.find('crealender_recommender') != int(-1):

    print('...Connected')

else:

    print('...Connection Failed')

# 1. Populate the rec system - take a JSON and return success
# 2. Recommend similar users - take a user ID and returns a Json {user_ids: [21,43]} of User IDs.
# 3. Recommend Events (optional only-nearby) - take a user ID and returns top 10 events (only-nearby -> location and interests as a pref, if not -> preferences)

big_df = pd.DataFrame({
    'event_id': [
        'ru_b_1', 'ru_b_2', 'ru_b_3', 'ru_b_4', 'ru_b_5', 'ru_b_6', 'ru_b_7',
        'ru_b_8', 'ru_b_9', 'ru_b_10', 'ru_b_5', 'sim_biz_1_1', 'sim_biz_1_2',
        'sim_biz_1_3', 'sim_biz_1_4', 'sim_biz_1_5', 'sim_biz_1_6',
        'sim_biz_1_7', 'sim_biz_1_8', 'sim_biz_1_9', 'sim_biz_1_10',
        'sim_biz_2_1', 'sim_biz_2_2', 'sim_biz_2_3', 'sim_biz_2_4',
        'sim_biz_2_5', 'sim_biz_2_6', 'sim_biz_2_7', 'sim_biz_2_8',
        'sim_biz_2_9', 'sim_biz_2_10', 'nsim_biz_1_1', 'nsim_biz_1_2',
        'nsim_biz_1_3', 'nsim_biz_1_4', 'nsim_biz_1_5', 'nsim_biz_1_6',
        'nsim_biz_1_7', 'nsim_biz_1_8', 'nsim_biz_1_9', 'nsim_biz_1_10'
    ],
    'stars_x': [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5,
        2, 5, 2, 5, 2, 5, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5
    ],
    'user_id': [
        'Merve', 'Merve', 'Merve', 'Merve', 'Merve', 'Merve', 'Merve', 'Merve',
        'Merve', 'Merve', 'Sri', 'Sri', 'Sri', 'Sri', 'Sri', 'Sri', 'Sri',
        'Sri', 'Sri', 'Sri', 'Sri', 'Julia', 'Julia', 'Julia', 'Julia', 'Julia',
        'Julia', 'Julia', 'Julia', 'Julia', 'Julia', 'Ilteber', 'Ilteber',
        'Ilteber', 'Ilteber', 'Ilteber', 'Ilteber', 'Ilteber', 'Ilteber',
        'Ilteber', 'Ilteber'
    ],
    'categories':
    [['Swimming', 'Physical', 'Outdoor'], ['Swimming', 'Physical', 'Outdoor'],
     ['Swimming', 'Physical', 'Outdoor'], ['Swimming', 'Physical',
                                           'Outdoor'], ['Swimming'],
     ['Swimming', 'Physical',
      'Outdoor'], ['Swimming', 'Physical',
                   'Outdoor'], ['Swimming', 'Physical',
                                'Outdoor'], ['Swimming', 'Physical', 'Outdoor'],
     ['Swimming', 'Physical',
      'Outdoor'], ['Swimming'], ['Swimming', 'Physical', 'Outdoor'], [
          'Swimming', 'Physical', 'Outdoor'
    ], ['Swimming', 'Physical',
        'Outdoor'], ['Swimming', 'Physical', 'Outdoor'], [
        'Swimming', 'Physical', 'Outdoor'
    ], ['Swimming', 'Physical',
            'Outdoor'], ['Swimming', 'Physical', 'Outdoor'], [
        'Swimming', 'Physical', 'Outdoor'
    ], ['Swimming', 'Physical',
            'Outdoor'], ['Swimming', 'Physical', 'Outdoor'], [
        'Swimming', 'Physical', 'Outdoor'
    ], ['Swimming', 'Physical',
            'Outdoor'], ['Swimming', 'Physical', 'Outdoor'], [
        'Swimming', 'Physical', 'Outdoor'
    ], ['Swimming', 'Physical',
            'Outdoor'], ['Swimming', 'Physical', 'Outdoor'], [
        'Swimming', 'Physical', 'Outdoor'
    ], ['Swimming', 'Physical', 'Outdoor'], [
        'Swimming', 'Physical', 'Outdoor'
    ], ['Swimming', 'Physical', 'Outdoor'],
        ['BookClub', 'Reading', 'Outdoor'], ['BookClub', 'Reading', 'Outdoor'], [
         'BookClub', 'Reading', 'Outdoor'
    ], ['BookClub', 'Reading', 'Outdoor'], ['BookClub', 'Reading', 'Outdoor'],
        ['BookClub', 'Reading', 'Outdoor'], ['BookClub', 'Reading', 'Outdoor'], [
         'BookClub', 'Reading', 'Outdoor'
    ], ['BookClub', 'Reading', 'Outdoor'], ['BookClub', 'Reading', 'Outdoor']],
    'city': [
        'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas',
        'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas',
        'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas',
        'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas',
        'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas',
        'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas',
        'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas',
        'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas', 'Las Vegas',
        'Las Vegas'
    ],
    'latitude': [
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
        12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6
    ],
    'longitude': [
        7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 15, 7, 9, 11, 13, 15, 17, 19, 21,
        23, 25, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 7, 9, 11, 13, 15, 17, 19,
        21, 23, 25
    ]
})

# Generating a list of businesses features
# In order to generate users preference vectors first we need to extract all
# features (categories) along which these vectors will be propagating...


def retreive_features(big_df):

    tag_lists = []

    for event_features in big_df.categories:

        for tags in event_features:

            tag_lists.append(tags)

    counter = collections.Counter(tag_lists)

    features = counter.most_common(len(counter))

    features_list = []

    for feature in features:

        features_list.append(feature[0])

    return features_list


def generate_user_pref_vectors(users, features_list):

    all_users_dict = dict()

    for user in users:
        current_user = big_df[big_df.user_id == user]
        normalize_by = len(current_user.user_id) * 5
        # not required, but good to have
        user_ratings = current_user.stars_x
        user_ratings_indexes = user_ratings.index
        user_categories_indexes = current_user.categories.index
        user_indexes = user_categories_indexes
        user_pref_dict = dict()

        for feature in features_list:

            user_pref_dict[feature] = 0

        for index in user_indexes:

            user_review_rating = user_ratings[user_ratings.index ==
                                              index].values[0]

            user_review_categories = current_user.categories[current_user.index
                                                             == index].values[0]

            for user_review_category in user_review_categories:

                user_pref_dict[user_review_category] = (
                    user_pref_dict[user_review_category] + user_review_rating
                ) / normalize_by

        all_users_dict[user] = user_pref_dict

    users_pref_df = pd.DataFrame.from_dict(
        all_users_dict, orient='index', dtype=None)

    return users_pref_df


def ref_user_pref(reco_user, users_pref_df):

    features = users_pref_df.columns.tolist()

    favorite_categories = users_pref_df[users_pref_df.index == reco_user]

    favorite_categories_dict = dict()

    for feature in features:

        favorite_categories_dict[feature] = favorite_categories[feature].values[
            0]

    reco_user_preferences = sorted(
        favorite_categories_dict.items(), key=lambda t: t[1])

    user_preferences_dict = dict()

    for item in reco_user_preferences:

        if item[1] != 0:

            user_preferences_dict[item[0]] = item[1]

        else:

            continue

    return user_preferences_dict


def calculate_similarity_by_cosines(indexes, users_pref_df, user_pref_vector):

    from sklearn.metrics.pairwise import cosine_similarity

    cos_sim_dict = dict()

    for index in indexes:

        other_user_pref_vector = users_pref_df[users_pref_df.index == index]

        cos_sim = cosine_similarity(user_pref_vector,
                                    other_user_pref_vector)[0][0]

        cos_sim_dict[index] = cos_sim

    sorted_user_similarities = sorted(cos_sim_dict.items(), key=lambda t: t[1])

    return sorted_user_similarities


# Give more weight to similar users and suppress ratings of users with low similarity...


def events_for_users(similar_users, big_df):

    bus_rating_dict = dict()

    for similar_user in similar_users:

        similar_user_id = similar_user[0]

        similar_user_cos_sim = similar_user[1]

        similar_user_sq_sim = similar_user_cos_sim**2

        similar_user_data = big_df[big_df.user_id == similar_user_id]

        for event_id in similar_user_data.event_id.unique():

            stars = similar_user_data[similar_user_data.event_id ==
                                      event_id].stars_x.values

            for star in stars:

                quadratic_business_rating = star * similar_user_sq_sim

                if event_id not in bus_rating_dict.keys():

                    bus_rating_dict.setdefault(event_id,
                                               []).append(similar_user_sq_sim)

                    bus_rating_dict.setdefault(
                        event_id, []).append(quadratic_business_rating)

                    bus_rating_dict.setdefault(event_id, []).append(
                        quadratic_business_rating / similar_user_sq_sim)

                else:

                    bus_rating_dict[event_id][
                        0] = bus_rating_dict[event_id][0] + similar_user_sq_sim

                    bus_rating_dict[event_id][
                        1] = bus_rating_dict[event_id][1] + quadratic_business_rating

                    bus_rating_dict[event_id][2] = float(
                        bus_rating_dict[event_id][1] /
                        bus_rating_dict[event_id][0])

    # transforming bus_rating_dict, retriving the 3rd value in the value field for each key
    similar_user_business_rating_dict = dict()

    for key in bus_rating_dict.keys():

        value = bus_rating_dict[key][2]

        similar_user_business_rating_dict[key] = value

        similar_user_business_rating_dict

    similar_user_business_rating_list = sorted(
        similar_user_business_rating_dict.items(), key=lambda t: t[1])

    return similar_user_business_rating_list


# Calculating distances between each business and reference user`s median loaction


def distance(similar_user_business_rating_list, big_df, user_mean_latitude,
             user_mean_longitude):

    sim_bus = dict()

    for similar_business in similar_user_business_rating_list:

        similar_event_id = similar_business[0]

        similar_business_longitude = big_df[
            big_df.event_id == similar_event_id].longitude.values[0]

        similar_business_latitude = big_df[big_df.event_id ==
                                           similar_event_id].latitude.values[0]

        distance = np.sqrt(
            (similar_business_longitude - user_mean_longitude)**2 +
            (similar_business_latitude - user_mean_latitude)**2)

        sim_bus[similar_business] = float("{0:.4f}".format(round(distance, 4)))

    return sim_bus


def combination_metric(sim_bus):

    distance_rating_sum_businesses = dict()

    for key in sim_bus.keys():

        if sim_bus[key] == 0:

            distance_rating_sum_businesses[key[0]] = key[1] * 100000000000

        elif ((sim_bus[key] != 0) & (sim_bus[key] >= 0.0001) &
              (sim_bus[key] < 0.001)):

            distance_rating_sum_businesses[key[
                0]] = key[1] * 10000 + 1 / sim_bus[key]

        elif ((sim_bus[key] != 0) & (sim_bus[key] >= 0.001) &
              (sim_bus[key] < 0.01)):

            distance_rating_sum_businesses[key[
                0]] = key[1] * 1000 + 1 / sim_bus[key]

        elif ((sim_bus[key] != 0) & (sim_bus[key] >= 0.01) &
              (sim_bus[key] < 0.1)):

            distance_rating_sum_businesses[key[
                0]] = key[1] * 100 + 1 / sim_bus[key]

        elif ((sim_bus[key] != 0) & (sim_bus[key] >= 0.1) & (sim_bus[key] < 1)):

            distance_rating_sum_businesses[key[
                0]] = key[1] * 10 + 1 / sim_bus[key]

        elif ((sim_bus[key] != 0) & (sim_bus[key] >= 1)):

            distance_rating_sum_businesses[key[
                0]] = key[1] * 1 + 1 / sim_bus[key]

    most_close_businesses_list = sorted(
        distance_rating_sum_businesses.items(), key=lambda t: t[1])

    return most_close_businesses_list


def combine_all_preferences(user_id, most_close_businesses_list, big_df):
    users = big_df.user_id.unique()
    users_pref_df = generate_user_pref_vectors(
        users, retreive_features(big_df))
    user_preferences_dict = ref_user_pref(user_id, users_pref_df)
    pref_weighted_businesses = dict()
    for business_item in most_close_businesses_list:
        business_categories = big_df[big_df.event_id == business_item[
            0]].categories.values[0]

        taste_score = 0

        for key in user_preferences_dict.keys():

            if key in business_categories:

                taste_score = (taste_score + user_preferences_dict[key])

            else:

                continue

        if taste_score > 0:

            taste_score = 1 + 100 * taste_score

        elif taste_score == 0:

            taste_score = 1

        pref_weighted_businesses[business_item[0]] = business_item[
            1] * taste_score

    return pref_weighted_businesses
