class AB
  class Yaml
    
    attr_reader :data
    attr_reader :path
    
    def initialize(path)
      if path && File.exists?(path)
        @path = path
        @data = YAML::load(File.open(@path))
      end
    end
    
    def configure_api
      if @data
        AB::Config.categories @data['categories']
        AB::Config.site @data['site']
        AB::Config.token @data['token']
        AB::Config.url @data['url']
      end
    end
    
    def dirname
      File.dirname(@path) if @path
    end
    
    def method_missing(method, *args)
      @data ? @data.send(method, *args) : nil
    end
  end
end