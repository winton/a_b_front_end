class ABPlugin
  module Helper
    
    private
    
    def a_b(category=nil, test=nil, extra=nil)
      @a_b_plugin ||= ABPlugin.new(self)
      
      if category || test || extra
        @a_b_plugin.test(category, test, extra)
      
      else
        @a_b_plugin.javascript
      end
    end
  end
end