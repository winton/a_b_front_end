require 'rubygems'
gem 'require'
require 'require'

Require do
  gem(:active_wrapper, '=0.2.5') { require 'active_wrapper' }
  gem :cucumber, '=0.6.2'
  gem(:haml, '=2.2.17') { require %w(haml sass) }
  gem(:lilypad, '=0.3.0') { require 'lilypad' }
  gem(:'rack-flash', '=0.1.1') { require 'rack-flash' }
  gem(:'rack-test', '=0.5.3') { require 'rack/test' }
  gem(:rake, '=0.8.7') { require 'rake' }
  gem :require, '=0.2.7'
  gem :rspec, '=1.3.0'
  gem(:sinatra, '=1.0') { require 'sinatra/base' }
  
  gemspec do
    author 'Winton Welsh'
    dependencies do
      gem :active_wrapper
      gem :haml
      gem :lilypad
      gem :'rack-flash'
      gem :require
      gem :sinatra
    end
    email 'mail@wintoni.us'
    name 'a_b_front_end'
    homepage "http://github.com/winton/#{name}"
    summary ""
    version '0.1.0'
  end
  
  bin { require 'lib/a_b_front_end' }
  
  console do
    gem :active_wrapper
    gem :sinatra
    load_path 'vendor/a_b_plugin/lib'
    load_path 'vendor/authlogic/lib'
    require 'a_b_plugin'
    require 'authlogic'
    require 'lib/a_b_front_end/boot/application'
    require 'lib/a_b_front_end/boot/a_b'
    require 'lib/a_b_front_end/boot/sinatra'
    require 'lib/a_b_front_end/boot/active_wrapper'
    require 'lib/a_b_front_end/boot/model'
  end
  
  lib do
    gem :haml
    gem :sinatra
    gem :active_wrapper
    gem :'rack-flash'
    load_path 'vendor/a_b_plugin/lib'
    load_path 'vendor/authlogic/lib'
    require 'authlogic'
    require 'lib/a_b_front_end/boot/application'
    require 'lib/a_b_front_end/boot/sinatra'
    require 'lib/a_b_front_end/boot/session'
    require 'lib/a_b_front_end/boot/flash'
    require 'lib/a_b_front_end/boot/active_wrapper'
    require 'a_b_plugin'
    require 'lib/a_b_front_end/boot/a_b'
    require 'lib/a_b_front_end/boot/lilypad'
    require 'lib/a_b_front_end/boot/controller'
    require 'lib/a_b_front_end/boot/helper'
    require 'lib/a_b_front_end/boot/model'
  end
  
  rakefile do
    gem(:active_wrapper) { require 'active_wrapper/tasks' }
    gem(:rake) { require 'rake/gempackagetask' }
    gem(:rspec) { require 'spec/rake/spectask' }
    require 'require/tasks'
  end
  
  spec_helper do
    gem :'rack-test'
    require 'require/spec_helper'
    require 'lib/a_b_front_end'
    require 'pp'
  end
end
