import pymongo  ## pylint: disable=import-error
url = "mongodb+srv://abbulahad105789:abbulahad105789@recipe-sharing.4zlre.mongodb.net/"
client = pymongo.MongoClient(url)
db = client["recipesharingapp"]
