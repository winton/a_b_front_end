class ABPlugin
  class API
    
    include HTTParty
    
    def self.create_category(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      post('/categories.json', :body => compress(
        :token => attributes.delete(:token) || Config.token,
        :category => attributes
      ))
    end
    
    def self.create_env(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      post('/envs.json', :body => compress(
        :token => attributes.delete(:token) || Config.token,
        :env => attributes
      ))
    end
    
    def self.create_site(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      post('/sites.json', :body => compress(
        :include => attributes.delete(:include),
        :only => attributes.delete(:only),
        :token => attributes.delete(:token) || Config.token,
        :site => attributes
      ))
    end
    
    def self.create_test(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      post('/tests.json', :body => compress(
        :include => attributes.delete(:include),
        :only => attributes.delete(:only),
        :token => attributes.delete(:token) || Config.token,
        :test => attributes
      ))
    end
    
    def self.create_user(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      post('/users.json', :body => compress(
        :token => Config.token,
        :user => attributes
      ))
    end
    
    def self.delete_category(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      delete('/categories.json', :query => compress(
        :token => attributes.delete(:token) || Config.token,
        :category => attributes
      ))
    end
    
    def self.delete_env(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      delete('/envs.json', :query => compress(
        :token => attributes.delete(:token) || Config.token,
        :env => attributes
      ))
    end
    
    def self.delete_site(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      delete('/sites.json', :query => compress(
        :token => attributes.delete(:token) || Config.token,
        :site => attributes
      ))
    end
    
    def self.delete_test(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      delete('/tests.json', :query => compress(
        :token => attributes.delete(:token) || Config.token,
        :test => attributes
      ))
    end
    
    def self.spec_js_setup
      return unless Config.token && Config.url
      base_uri Config.url
      get '/spec/js/setup.json'
    end
    
    def self.sites(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      get('/sites.json', :query => compress(
        :include => attributes.delete(:include),
        :only => attributes.delete(:only),
        :token => attributes.delete(:token) || Config.token,
        :site => attributes
      ))
    end
    
    def self.update_category(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      put('/categories.json', :body => compress(
        :include => attributes.delete(:include),
        :only => attributes.delete(:only),
        :token => attributes.delete(:token) || Config.token,
        :category => attributes
      ))
    end
    
    def self.update_env(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      put('/envs.json', :body => compress(
        :include => attributes.delete(:include),
        :only => attributes.delete(:only),
        :token => attributes.delete(:token) || Config.token,
        :env => attributes
      ))
    end
    
    def self.update_site(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      put('/sites.json', :body => compress(
        :include => attributes.delete(:include),
        :only => attributes.delete(:only),
        :token => attributes.delete(:token) || Config.token,
        :site => attributes
      ))
    end
    
    def self.update_test(attributes={})
      return unless Config.token && Config.url
      base_uri Config.url
      put('/tests.json', :body => compress(
        :include => attributes.delete(:include),
        :only => attributes.delete(:only),
        :token => attributes.delete(:token) || Config.token,
        :test => attributes
      ))
    end
    
    private
    
    def self.compress(hash)
      hash.delete_if { |key, value| value.nil? || value.empty? }
    end
  end
end