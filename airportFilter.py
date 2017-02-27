import json
from pprint import pprint

with open('airports.json') as data_file:    
    data = json.load(data_file)
post_process=[]
for i in data:
	if i['status']==0:
		continue
	if i['type']!='airport':
		continue
	if i['iso']!='US':
		continue
	post_process.append(i)
	print i
with open('airportlist.json', 'w') as outfile:
	json.dump(post_process, outfile)