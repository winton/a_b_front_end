require File.dirname(__FILE__) + '/a_b_front_end/gems'

ABFrontEnd::Gems.require(:lib)

$:.unshift File.expand_path(
  File.dirname(__FILE__) + '/../vendor/authlogic/lib'
)

$:.unshift File.dirname(__FILE__) + '/a_b_front_end'

require 'version'

require 'boot/application'
require 'boot/sinatra'
require 'boot/session'
require 'boot/active_wrapper'
require 'boot/a_b'
require 'boot/flash'
require 'boot/haml'
require 'boot/lilypad'
require 'boot/controller'
require 'boot/helper'
require 'authlogic'
require 'boot/model'