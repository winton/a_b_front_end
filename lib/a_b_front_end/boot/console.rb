require File.expand_path('../../gems', __FILE__)

ABFrontEnd::Gems.require(:console)

$:.unshift File.expand_path(File.dirname(__FILE__) + '/../../../vendor/authlogic/lib')
require 'authlogic'

require File.dirname(__FILE__) + '/application'
require File.dirname(__FILE__) + '/sinatra'
require File.dirname(__FILE__) + '/active_wrapper'
require File.dirname(__FILE__) + '/a_b'
require File.dirname(__FILE__) + '/model'