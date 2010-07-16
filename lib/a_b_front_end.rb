require 'rubygems'
require 'bundler'

require 'json'

Bundler.require(:lib)

$:.unshift File.dirname(__FILE__) + '/a_b_front_end'
$:.unshift File.expand_path(File.dirname(__FILE__) + '/../vendor/a_b_plugin/lib')
$:.unshift File.expand_path(File.dirname(__FILE__) + '/../vendor/authlogic/lib')

require 'a_b_plugin'
require 'authlogic'

require 'version'

require 'boot/application'
require 'boot/sinatra'
require 'boot/session'
require 'boot/flash'
require 'boot/active_wrapper'
require 'boot/a_b'
require 'boot/lilypad'
require 'boot/controller'
require 'boot/helper'
require 'boot/model'