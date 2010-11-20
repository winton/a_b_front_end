# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib/', __FILE__)
$:.unshift lib unless $:.include?(lib)

require 'a_b/gems'
require 'a_b/version'

Gem::Specification.new do |s|
  s.name = "a_b"
  s.version = AB::VERSION
  s.platform = Gem::Platform::RUBY
  s.authors = ["Winton Welsh"]
  s.email = ["mail@wintoni.us"]
  s.homepage = "http://github.com/winton/a_b"
  s.summary = "Talk to a_b from your Rails or Sinatra app"
  s.description = "Provides the a_b method to your application controller and helper"

  AB::Gems::TYPES[:gemspec].each do |g|
    s.add_dependency g.to_s, AB::Gems::VERSIONS[g]
  end
  
  AB::Gems::TYPES[:gemspec_dev].each do |g|
    s.add_development_dependency g.to_s, AB::Gems::VERSIONS[g]
  end

  s.files = Dir.glob("{bin,lib}/**/*") + %w(LICENSE README.md)
  s.executables = Dir.glob("{bin}/*").collect { |f| File.basename(f) }
  s.require_path = 'lib'
end