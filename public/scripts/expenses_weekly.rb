require 'rubygems'
require 'open-uri'
require 'json'

url = 'https://docs.google.com/spreadsheets/d/1EBMH3iW6LaEg_N9cvjjAU2uzi2-tD7pEojsQQ_ftEik/pub?gid=1575038387&single=true&output=csv'
p (JSON.parse(open(url).read)).to_json