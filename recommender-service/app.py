import collections
from pymongo import MongoClient
import pprint
import pymongo
import json
from pandas.io.json import json_normalize
import numpy as np
import pandas as pd
import seaborn as sb
import matplotlib.pyplot as plt
from flask import request, jsonify
from bson.objectid import ObjectId

from .helpers import *

from flask import Flask
app = Flask(__name__)

# Creating a MongoDB connection client...

client = MongoClient('mongodb://localhost:27017')

db = client.crealendardb

con_check = str(db)

if con_check.find('crealendardb') != int(-1):

    print('...Connected')

else:

    print('...Connection Failed')
    
collection = db["userprofiles"]
print("here")
allUsers = collection.find({"role": "User"})
allUserIds = collection["_id"]
allOrganizers = collection.find({"role": "Organizer"})
for x in allUserIds:
  print(x)


def getSimilarEventsforUser(user_id):
    users = big_df.user_id.unique()
    users_pref_df = generate_user_pref_vectors(
        users, retreive_features(big_df))
    user_pref_vector = users_pref_df[users_pref_df.index == user_id]
    indexes = users_pref_df[
        users_pref_df.index != user_pref_vector.index[0]].index
    sorted_users_by_similarity_scores = calculate_similarity_by_cosines(
        indexes, users_pref_df, user_pref_vector)
    similar_users_top_3 = sorted_users_by_similarity_scores[-3:]
    match_users_with_events = events_for_users(
        similar_users_top_3, big_df)  # 9
    event_location_latitudes = big_df[big_df.user_id ==
                                      user_id].latitude.tolist()
    event_location_longitudes = big_df[big_df.user_id ==
                                       user_id].longitude.tolist()
    geo_center_latitude = np.median((event_location_latitudes))
    geo_center_longitude = np.median((event_location_longitudes))
    geo_distance_between_user_and_events = distance(match_users_with_events,
                                                    big_df, geo_center_latitude,
                                                    geo_center_longitude)
    closest_events = combination_metric(geo_distance_between_user_and_events)
    final_weights = combine_all_preferences(user_id, closest_events, big_df)
    return sorted(final_weights.items(), key=lambda t: t[1])[-10:]


def getSimilarUsers(reco_user):
    users = big_df.user_id.unique()
    users_pref_df = generate_user_pref_vectors(
        users, retreive_features(big_df))
    user_pref_vector = users_pref_df[users_pref_df.index == reco_user]
    indexes = users_pref_df[
        users_pref_df.index != user_pref_vector.index[0]].index
    sorted_user_similarities = calculate_similarity_by_cosines(
        indexes, users_pref_df, user_pref_vector)
    return sorted_user_similarities[-3:]


@app.route('/')
def hello_world():
    return 'Welcome to Crealendar - Recommendation Microservice'


@app.route('/populate', methods=['POST'])
def populate():
    assert request.method == 'POST'
    big_df = populate_recommender(request.form['data'])


# returns top 3 users by sorted cosine similarites
@app.route('/getSimilarUsers/<user_id>')
# @app.route('/getSimilarUsers', methods=['GET', 'POST'])
def similarUsers(user_id):
    # return str(request.form['user_id'])
    users_list = getSimilarUsers(user_id)
    return jsonify([list(user) for user in users_list])


@app.route('/getSimilarEventsforUser/<user_id>')
def similarEventsforUser(user_id):
    # return str(user_id)
    events_list = getSimilarEventsforUser(user_id)
    return jsonify([list(event) for event in events_list])
