class AB
  module Adapters
    module Sinatra
      
      def self.included(klass)
        AB do
          env klass.environment
          root klass.root
        end
      end
    end
  end
end

Sinatra::Base.send(:include, AB::Helper)