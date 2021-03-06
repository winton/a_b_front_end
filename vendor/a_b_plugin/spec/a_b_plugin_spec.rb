require File.dirname(__FILE__) + '/spec_helper'

describe ABPlugin do
  
  before(:each) do
    ENV['RACK_ENV'] = 'testing'
    ABPlugin.reset
  end
  
  after(:each) do
    ENV['RACK_ENV'] = nil
    ABPlugin.reset
  end
  
  describe "with no configuration" do
    
    it "should only assign cached_at" do
      ABPlugin.new
      
      ABPlugin.cached_at.to_s.should == (Time.now - 1 * 60).to_s
      ABPlugin.instance.should == nil
      
      ABPlugin::Config.categories.should == nil
      ABPlugin::Config.site.should == nil
      ABPlugin::Config.token.should == nil
      ABPlugin::Config.url.should == nil
    end
    
    it "should not call the API" do
      ABPlugin::API.should_not_receive(:boot)
      ABPlugin.new
    end
  end
  
  describe "with configuration, but no configs exist" do
    
    before(:each) do
      ABPlugin do
        root "#{$root}/spec/does_not_exist"
      end
    end
  
    it "should only assign cached_at" do
      ABPlugin.new

      ABPlugin.cached_at.to_s.should == (Time.now - 1 * 60).to_s
      ABPlugin.instance.should == nil
      
      ABPlugin::Config.categories.should == nil
      ABPlugin::Config.site.should == nil
      ABPlugin::Config.token.should == nil
      ABPlugin::Config.url.should == nil
    end
  end
  
  describe "when api config exists" do
    
    before(:each) do
      ABPlugin do
        root "#{$root}/spec/fixtures/api_yaml"
      end
    end
  
    it "should only assign cached_at, token, url" do
      ABPlugin.new
      
      ABPlugin.cached_at.to_s.should == (Time.now - 1 * 60).to_s
      ABPlugin.instance.should == nil
      
      ABPlugin::Config.categories.should == nil
      ABPlugin::Config.site.should == 'site'
      ABPlugin::Config.token.should == 'token'
      ABPlugin::Config.url.should == 'url'
    end
  end
  
  describe "when tests config exists" do
    
    before(:each) do
      setup_variables
      ABPlugin do
        root "#{$root}/spec/fixtures/tests_yaml"
      end
    end
    
    it "should only assign cached_at and tests" do
      ABPlugin.new
      
      ABPlugin.cached_at.to_s.should == Time.now.to_s
      ABPlugin.instance.should == nil
      
      ABPlugin::Config.categories.should == @site['categories']
      ABPlugin::Config.site.should == nil
      ABPlugin::Config.token.should == nil
      ABPlugin::Config.url.should == nil
    end
  end
  
  describe "when api and tests configs exist" do
    
    before(:each) do
      setup_variables
      ABPlugin do
        root "#{$root}/spec/fixtures/both_yaml"
      end
    end
    
    it "should assign everything" do
      ABPlugin.new
      
      ABPlugin.cached_at.to_s.should == Time.now.to_s
      ABPlugin.instance.should == nil
      
      ABPlugin::Config.categories.should == @site['categories']
      ABPlugin::Config.site.should == 'site'
      ABPlugin::Config.token.should == 'token'
      ABPlugin::Config.url.should == 'url'
    end
  end
  
  describe "when in binary mode" do
    describe "and api config present" do
      
      before(:each) do
        setup_variables
        ABPlugin do
          binary true
          root "#{$root}/spec/fixtures/api_yaml"
        end
      end
      
      it "should call API.get" do
        ABPlugin::API.should_receive(:get).with('/sites.json',
          :query => {
            :site => { :name => "site" },
            :include => {
              :categories => {
                :include => {
                  :tests => {
                    :include => {
                      :variants=>true
                    }
                  }
                }
              }
            },
            :token=>"token",
            :only => [ :id, :name, :tests, :variants ]
          }
        ).and_return(nil)
        ABPlugin.new
      end
      
      it "should write test data to the config" do
        data = File.read(ABPlugin::Config.yaml)
        begin
          stub_api_boot
          ABPlugin.new
          yaml = ABPlugin::Yaml.new(ABPlugin::Config.yaml)
          yaml['categories'].should == @site['categories']
        ensure
          File.open(ABPlugin::Config.yaml, 'w') do |f|
            f.write(data)
          end
        end
      end
    end
    
    describe "and api config not present" do
      
      before(:each) do
        setup_variables
        ABPlugin do
          binary true
        end
      end
      
      it "should not call API.get" do
        ABPlugin::API.should_not_receive(:get)
        ABPlugin.new
      end
    end
  end
  
  describe :load_yaml? do
    
    it "should be false after first attempt" do
      ABPlugin.new
      ABPlugin.load_yaml?.should == false
    end
  end
end
