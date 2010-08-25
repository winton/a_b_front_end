require File.dirname(__FILE__) + '/a_b_plugin/gems'

ABPlugin::Gems.require(:lib)

require 'httparty'

$:.unshift File.dirname(__FILE__) + '/a_b_plugin'

require 'version'

require 'api'
require 'config'
require 'cookies'
require 'datastore'
require 'helper'
require 'test'
require File.dirname(__FILE__) + '/a_b_plugin/yaml'

class ABPlugin
  
  def initialize(instance=nil)
    ABPlugin.instance = instance
    
    if Config.binary
      ABPlugin.write_yaml
    elsif ABPlugin.load_yaml?
      ABPlugin.load_yaml
    end
  end
  
  class <<self
    
    attr_accessor :cached_at
    attr_accessor :instance
    
    def load_yaml?
      if @cached_at
        seconds_cached = (Time.now - @cached_at).to_i
        seconds_cached >= 10 * 60
      else
        true
      end
    end
    
    def load_yaml
      @cached_at = Time.now
      
      yaml = Yaml.new(Config.yaml)
      yaml.configure_api
      
      unless Config.categories
        @cached_at = Time.now - 1 * 60 # Try again in 1 minute
      end
    end
    
    def reset
      $cookies = @cached_at = @instance = nil
      Config.reset
    end
    
    def site(name)
      API.sites(
        :include => {
          :categories => {
            :include => {
              :tests => {
                :include => {
                  :variants => true
                }
              }
            }
          }
        },
        :only => [ :id, :category_id, :name, :tests, :variants ],
        :name => name
      )
    end
    
    def write_yaml
      yaml = Yaml.new(Config.yaml)
      yaml.configure_api
      if Config.site
        site = self.site(Config.site)
        if site
          yaml.data['categories'] = site['categories']
          File.open(Config.yaml, 'w') do |f|
            f.write(yaml.data.to_yaml)
          end
        end
      end
    end
  end
end

def ABPlugin(&block)
  ABPlugin::Config.class_eval &block
end

require 'adapters/rails' if defined?(Rails)
require 'adapters/sinatra' if defined?(Sinatra)