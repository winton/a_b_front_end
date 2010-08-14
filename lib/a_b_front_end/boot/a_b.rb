$:.unshift File.expand_path(File.dirname(__FILE__) + '/../../../vendor/a_b_plugin/lib')
require 'a_b_plugin'

Application.class_eval do
  include ABPlugin::Adapters::Sinatra
  ABPlugin.new
end