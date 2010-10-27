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
  
  attr_reader :data
  attr_reader :send
  
  def initialize(instance=nil)
    ABPlugin.instance = instance
    
    @data = Cookies.get('a_b')
    @send = Cookies.get('a_b_s')
    
    @data = @data ? JSON(@data) : {}
    @send = @send ? JSON(@send) : {}
    
    @data = symbolize_keys(@data)
    @send = symbolize_keys(@send)
    
    if Config.binary
      ABPlugin.write_yaml
    elsif ABPlugin.load_yaml?
      ABPlugin.load_yaml
    end
  end
  
  def javascript
    if Config.categories && Config.url
      "a_b_setup(#{{
        :categories => Config.categories,
        :data => @data,
        :env => Config.env,
        :send => @send,
        :url => Config.url
      }.to_json});"
    end
  end
  
  def test(category=nil, test=nil, extra=nil)
    Test.new(@data, @send, category, test, extra)
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
        :only => [ :id, :name, :tests, :variants ],
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
  
  private
  
  def symbolize_keys(hash)
    hash.inject({}) do |options, (key, value)|
      options[(key.to_sym rescue key) || key] = value
      options
    end
  end
end

def ABPlugin(&block)
  ABPlugin::Config.class_eval &block
end

require 'adapters/rails' if defined?(Rails)
require 'adapters/sinatra' if defined?(Sinatra)