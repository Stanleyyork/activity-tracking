require 'rubygems'
require 'open-uri'
require 'json'

url = 'https://spreadsheets.google.com/feeds/list/1EBMH3iW6LaEg_N9cvjjAU2uzi2-tD7pEojsQQ_ftEik/od6/public/values?alt=json'
p (JSON.parse(open(url).read)).to_json