require 'rubygems'
require 'bundler'

Bundler.require(:console)

$:.unshift File.expand_path(File.dirname(__FILE__) + '/../')
$:.unshift File.expand_path(File.dirname(__FILE__) + '/../../../vendor/authlogic/lib')
$:.unshift File.expand_path(File.dirname(__FILE__) + '/../../../vendor/a_b_plugin/lib')

require 'authlogic'
require 'a_b_plugin'

require 'boot/application'
require 'boot/sinatra'
require 'boot/active_wrapper'
require 'boot/model'