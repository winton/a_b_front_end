require File.dirname(__FILE__) + '/spec_helper'

describe AB do
  
  before(:each) do
    ENV['RACK_ENV'] = 'testing'
    AB.reset
  end
  
  after(:each) do
    ENV['RACK_ENV'] = nil
    AB.reset
  end
  
  describe "with no configuration" do
    
    it "should only assign cached_at" do
      AB.new
      
      AB.cached_at.to_s.should == (Time.now - 1 * 60).to_s
      AB.instance.should == nil
      
      AB::Config.categories.should == nil
      AB::Config.site.should == nil
      AB::Config.token.should == nil
      AB::Config.url.should == nil
    end
    
    it "should not call the API" do
      AB::API.should_not_receive(:boot)
      AB.new
    end
  end
  
  describe "with configuration, but no configs exist" do
    
    before(:each) do
      AB do
        root "#{$root}/spec/does_not_exist"
      end
    end
  
    it "should only assign cached_at" do
      AB.new

      AB.cached_at.to_s.should == (Time.now - 1 * 60).to_s
      AB.instance.should == nil
      
      AB::Config.categories.should == nil
      AB::Config.site.should == nil
      AB::Config.token.should == nil
      AB::Config.url.should == nil
    end
  end
  
  describe "when api config exists" do
    
    before(:each) do
      AB do
        root "#{$root}/spec/fixtures/api_yaml"
      end
    end
  
    it "should only assign cached_at, token, url" do
      AB.new
      
      AB.cached_at.to_s.should == (Time.now - 1 * 60).to_s
      AB.instance.should == nil
      
      AB::Config.categories.should == nil
      AB::Config.site.should == 'site'
      AB::Config.token.should == 'token'
      AB::Config.url.should == 'url'
    end
  end
  
  describe "when tests config exists" do
    
    before(:each) do
      setup_variables
      AB do
        root "#{$root}/spec/fixtures/tests_yaml"
      end
    end
    
    it "should only assign cached_at and tests" do
      AB.new
      
      AB.cached_at.to_s.should == Time.now.to_s
      AB.instance.should == nil
      
      AB::Config.categories.should == @site['categories']
      AB::Config.site.should == nil
      AB::Config.token.should == nil
      AB::Config.url.should == nil
    end
  end
  
  describe "when api and tests configs exist" do
    
    before(:each) do
      setup_variables
      AB do
        root "#{$root}/spec/fixtures/both_yaml"
      end
    end
    
    it "should assign everything" do
      AB.new
      
      AB.cached_at.to_s.should == Time.now.to_s
      AB.instance.should == nil
      
      AB::Config.categories.should == @site['categories']
      AB::Config.site.should == 'site'
      AB::Config.token.should == 'token'
      AB::Config.url.should == 'url'
    end
  end
  
  describe "when in binary mode" do
    describe "and api config present" do
      
      before(:each) do
        setup_variables
        AB do
          binary true
          root "#{$root}/spec/fixtures/api_yaml"
        end
      end
      
      it "should call API.get" do
        AB::API.should_receive(:get).with('/sites.json',
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
        AB.new
      end
      
      it "should write test data to the config" do
        data = File.read(AB::Config.yaml)
        begin
          stub_api_boot
          AB.new
          yaml = AB::Yaml.new(AB::Config.yaml)
          yaml['categories'].should == @site['categories']
        ensure
          File.open(AB::Config.yaml, 'w') do |f|
            f.write(data)
          end
        end
      end
    end
    
    describe "and api config not present" do
      
      before(:each) do
        setup_variables
        AB do
          binary true
        end
      end
      
      it "should not call API.get" do
        AB::API.should_not_receive(:get)
        AB.new
      end
    end
  end
  
  describe :load_yaml? do
    
    it "should be false after first attempt" do
      AB.new
      AB.load_yaml?.should == false
    end
  end
end