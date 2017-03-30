#A utility tool that takes all the airports in airportlist.json and only returns United States airports

import json
from pprint import pprint

with open('airports.json') as data_file:    
    data = json.load(data_file)
post_process=[]
for i in data:
	if i['status']==0: #check if airport is open
		continue
	if i['type']!='airport': #check if this is an airport. The airport list also has dockyards?
		continue
	if i['iso']!='US': #Check the we are in the US
		continue
	post_process.append(i)
	print i
post_process=sorted(post_process, key=lambda x: x['iata']) #Sort by iata code
with open('airportlist.json', 'w') as outfile: #dump into outfile
	json.dump(post_process, outfile)