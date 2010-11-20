class AB
  module Adapters
    module Rails
    
      def self.included(klass)
        AB do
          env ::Rails.env
          root ::Rails.root
        end
      end
    end
  end
end

ActionController::Base.send(:include, AB::Adapters::Rails)
ActionController::Base.send(:include, AB::Helper)
ActionController::Base.helper(AB::Helper)