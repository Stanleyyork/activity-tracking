require 'rubygems'
require 'open-uri'
require 'json'

url = "https://www.coach.me/api/v3/users/120776/stats?expanded=true"
p (JSON.parse(open(url).read)).to_json