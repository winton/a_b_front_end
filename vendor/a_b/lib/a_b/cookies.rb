class AB
  class Cookies
    class <<self
      
      def get(key)
        return unless AB.instance
      
        if AB.instance.respond_to?(:cookies)
          AB.instance.send(:cookies)[key.to_s]
        
        elsif AB.instance.respond_to?(:request)
          AB.instance.request.cookies[key.to_s]
      
        else
          $cookies ||= {}
          $cookies[key.to_s]
        end
      end
    
      def set(key, value)
        return unless AB.instance
      
        if AB.instance.respond_to?(:cookies)
          if value.nil?
            AB.instance.send(:cookies).delete(key.to_s)
          else
            AB.instance.send(:cookies)[key.to_s] = value
          end
        
        elsif AB.instance.respond_to?(:response)
          if value.nil?
            AB.instance.response.delete_cookie(key.to_s)
            AB.instance.request.cookies[key.to_s] = nil
          else  
            AB.instance.response.set_cookie(key.to_s, :value => value, :path => '/')
            AB.instance.request.cookies[key.to_s] = value
          end
      
        else
          $cookies ||= {}
          $cookies[key.to_s] = value
        end
      
        true
      end
    end
  end
end