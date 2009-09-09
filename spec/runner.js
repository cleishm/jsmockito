/*
Sections of the code below taken from the blue-ridge rake plugin:

  http://github.com/relevance/blue-ridge

Copyright (c) 2008-2009 Relevance, Inc.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

load('../lib/env.rhino.js');
window.location = 'suite-dist.html';

var scripts = document.getElementsByTagName('script');
for (var i=0; i < scripts.length; i++) {
  if (scripts[i].getAttribute('type') == 'text/javascript') {
    try {
      load(scripts[i].src);
    } catch(e) {
      $error("Error loading script", e);
    }
  }
}

(function($) {
  var passed = 0;
  var failed = 0;

  $(Screw).bind("before", function(){
    function example_name(element){
      // TODO: handle nested describes!
      var context_name = $(element).parents(".describe").children("h1").text();
      var example_name = $(element).children("h2").text();

      return context_name + " - " + example_name;
    }

    $('.it').bind('passed', function() { 
      passed++;
      java.lang.System.out.print(".");
    }).bind('failed', function(e, reason) {
      failed++;
      print("\nFAILED: " + example_name(this));
      print("          " + reason + "\n");
    });
  });

  $(Screw).bind("after", function() {
    var testCount = passed + failed;
    var elapsedTime = ((new Date() - Screw.suite_start_time)/1000.0);
    
    print("\n");
    print(testCount + ' test(s), ' + failed + ' failure(s)');
    print(elapsedTime.toString() + " seconds elapsed");
    
    if (failed > 0) { java.lang.System.exit(1) };
    java.lang.System.exit((failed > 0)? 1 : 0);
  });
})(jQuery);

jQuery(window).trigger("load");
