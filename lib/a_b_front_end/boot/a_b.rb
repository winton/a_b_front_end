$:.unshift File.expand_path(File.dirname(__FILE__) + '/../../../vendor/a_b/lib')
require 'a_b'

Application.class_eval do
  include AB::Adapters::Sinatra
  AB.new
end