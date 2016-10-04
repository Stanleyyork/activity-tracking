require 'rubygems'
require 'open-uri'
require 'json'
require 'openssl'
OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
url = 'https://docs.google.com/spreadsheets/d/1EBMH3iW6LaEg_N9cvjjAU2uzi2-tD7pEojsQQ_ftEik/pub?gid=2029940298&single=true&output=csv'
p open(url).read