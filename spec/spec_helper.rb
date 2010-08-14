$root = File.expand_path('../../', __FILE__)
require "#{$root}/lib/a_b_front_end/gems"

ABFrontEnd::Gems.require(:spec)

require 'rack/test'

Spec::Runner.configure do |config|
end

require 'pp'

# For use with rspec textmate bundle
def debug(object)
  puts "<pre>"
  puts object.pretty_inspect.gsub('<', '&lt;').gsub('>', '&gt;')
  puts "</pre>"
end