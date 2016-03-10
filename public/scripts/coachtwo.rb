require 'rubygems'
require 'open-uri'
require 'json'

url = "https://www.coach.me/api/v3/users/120776/activity?limit=100&sort=id"
p (JSON.parse(open(url).read)).to_json