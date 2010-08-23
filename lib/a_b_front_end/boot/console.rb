require File.expand_path('../../gems', __FILE__)

ABFrontEnd::Gems.require(:console)

$:.unshift File.expand_path(File.dirname(__FILE__) + '/../../../vendor/authlogic/lib')
$:.unshift File.dirname(__FILE__) + '/../'

require 'boot/application'
require 'boot/sinatra'
require 'boot/active_wrapper'
require 'boot/a_b'
require 'boot/authlogic'
require 'boot/model'