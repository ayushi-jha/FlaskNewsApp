from flask import Flask, jsonify, request  # import flask
from newsapi import NewsApiClient
from newsapi.newsapi_exception import NewsAPIException
application = Flask(__name__, static_url_path="/static")

newsapi = NewsApiClient(api_key='XXXXX')
top_headlines = newsapi.get_top_headlines(page_size=30, language='en',country='us')
all_cnn_articles = newsapi.get_everything(sources='cnn', language='en')
all_fox_articles = newsapi.get_everything(sources='fox-news', language='en')
filename="static/stopwords_en.txt"
stop_words = [line.rstrip() for line in open(filename)]


cnn_articles = all_cnn_articles['articles']
fox_articles = all_fox_articles['articles']
headlines = top_headlines['articles']
freq_dict = {}
for article in headlines:
    current_title = article['title']
    for word in current_title.split():
        word = word.lower()
        if word in stop_words or word in '-+=0123456789:,.':
            continue
        else:
            if word in freq_dict:
                freq_dict[word] += 1
            else:
                freq_dict[word] = 1

temp_cloud_list = sorted(freq_dict.items(), key=lambda x:-x[1])[:30]
print (temp_cloud_list)
cloud_list = []
for item in temp_cloud_list:
    cloud_list.append({'word': item[0], 'size': item[1]})
slides = list()
for article in headlines:
    flag = 0
    for item in ['source', 'author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'content']:
        if flag == 1:
            break
        if item not in article:
            flag = 1
            continue
        else:
            if item == 'source':
                if 'id' not in article['source'] and 'name' not in article['source']:
                    flag = 1
                    continue
                elif article['source']['id'] is None and article['source']['name'] is None:
                    flag = 1
                    continue
            if article[item] is None or article[item] == "null":
                flag = 1
                continue
    if flag == 0:
        slides.append(article)
    if len(slides) >= 5:
        break

# --- CNN ----------
cnn_list = list()
for article in cnn_articles:
    flag = 0
    for item in ['source', 'author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'content']:
        if flag == 1:
            break
        if item not in article:
            flag = 1
            continue
        else:
            if item == 'source':
                if 'id' not in article['source'] and 'name' not in article['source']:
                    flag = 1
                    continue
                elif article['source']['id'] is None and article['source']['name'] is None:
                    flag = 1
                    continue
            if article[item] is None or article[item] == "null":
                flag = 1
                continue
    if flag == 0:
        cnn_list.append(article)
    if len(cnn_list) >= 4:
        break

# --- FOX ----------
fox_list = list()
for article in fox_articles:
    flag = 0
    for item in ['source', 'author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'content']:
        if flag == 1:
            break
        if item not in article:
            flag = 1
            continue
        else:
            if item == 'source':
                if 'id' not in article['source'] and 'name' not in article['source']:
                    flag = 1
                    continue
                elif article['source']['id'] is None and article['source']['name'] is None:
                    flag = 1
                    continue
            if article[item] is None or article[item] == "null":
                flag = 1
                continue
    if flag == 0:
        fox_list.append(article)
    if len(fox_list) >= 4:
        break

result = {}
result['slides'] = slides
result['cloud'] = cloud_list
result['cnn'] = cnn_list
result['fox'] = fox_list



@application.route("/")                   # at the end point /
def hello():                      # call method hello
    return application.send_static_file("index.html")       # which returns "hello world"

@application.route("/show_news", methods=['GET'])
def show_news():
    return jsonify(result)

@application.route("/show_search", methods=['GET'])
def show_search():
    print ("In show search", request.args.get("from_val"))
    from_val = request.args.get("from_val")
    to_val = request.args.get("to_val")
    keyword = request.args.get("keyword")
    sources = request.args.get("sources")
    try:
        if sources == "" or sources == "all":
            all_search_results = newsapi.get_everything(q=keyword, from_param=from_val, to=to_val, language="en", page_size=30, sort_by="publishedAt")
        else:
            all_search_results = newsapi.get_everything(q=keyword, sources=sources, from_param=from_val, to=to_val, language="en", page_size=30, sort_by="publishedAt")

    except NewsAPIException as e:
        print ("Exception: ", e.get_message())
        return jsonify({"error": e.get_message()})
    print (all_search_results)
    search_results = all_search_results['articles']
    search_list = []
    for article in search_results:
        flag = 0
        for item in ['source', 'author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'content']:
            if flag == 1:
                break
            if item not in article:
                flag = 1
                continue
            else:
                if item == 'source':
                    if 'name' not in article['source']:
                        flag = 1
                        continue
                if article[item] is None or article[item] == "null":
                    flag = 1
                    continue
        if flag == 0:
            search_list.append(article)

    return jsonify({'search_results':search_list})

@application.route("/get_sources", methods=['GET'])
def get_sources():
    sources = {}
    print ("In get sources", request.args.get("categ"))
    categ = request.args.get("categ")
    try:
        all_sources = newsapi.get_sources(category=categ, country="us", language="en")
    except NewsAPIException as e:
        print("Exception: ", e.get_message())
        return jsonify({"error": e.get_message()})
    print (all_sources)
    source_list = [{'id':source['id'], 'source':source['name']} for source in all_sources['sources']]
    sources['source_list'] = source_list
    return jsonify(sources)

if __name__ == "__main__":        # on running python app.py
    application.run()
