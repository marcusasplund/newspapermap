//ISSUE: activeBtnClass not removed when a new link is given this class - causing a lot of active buttons.
(function($,window,undefined){
  $( window.document ).bind('mobileinit', function(){
    if ($.mobile.media("screen and (min-width:480px)")) {
      $('div[data-role="panel"]').addClass('ui-mobile-viewport');
      if( !$.mobile.hashListeningEnabled || !$.mobile.path.stripHash( location.hash ) ){
        var firstPage=$('div[data-id="main"] > div[data-role="page"]:first').page().addClass($.mobile.activePageClass) 
        firstPage.children('div[data-role="footer"]').hide();
        firstPage.children('div[data-role="content"]').attr('data-scroll', 'y');
      }
      $(function() {
        $(document).unbind('.toolbar');
        $('.ui-page').die('.toolbar');
        $(window).trigger('orientationchange');
      });

//----------------------------------------------------------------------------------
//Main event bindings: click, form submits, hashchange and orientationchange/resize
//----------------------------------------------------------------------------------
      //DONE: link click event binding for changePage
      $("a").die('click');
      //this will mostly be a copy of the original handler with some modifications
      $("a").live('click', function(event){
        var $this=$(this),
            href = $this.attr( "href" ) || "#",
            hadProtocol = $.mobile.path.hasProtocol( href ),
            url = $.mobile.path.clean( href ),
            isRelExternal = $this.is( "[rel='external']" ),
            isEmbeddedPage = $.mobile.path.isEmbeddedPage( url ),
            isExternal = $.mobile.path.isExternal( url ) || (isRelExternal && !isEmbeddedPage),
            hasTarget = $this.is( "[target]" ),
            hasAjaxDisabled = $this.is( "[data-ajax='false']" ),
            
            $targetPanel=$this.attr('data-panel'),
            $targetContainer=$('div[data-id='+$targetPanel+']'),
            $targetPanelActivePage=$targetContainer.children('div.'+$.mobile.activePageClass),
            $currPanel=$this.parents('div[data-role="panel"]'),
            //not sure we need this. if you want the container of the element that triggered this event, $currPanel 
            $currContainer=$.mobile.pageContainer, 
            $currPanelActivePage=$currPanel.children('div.'+$.mobile.activePageClass),
            from = null;

        if( $this.is( "[data-rel='back']" ) ){
          window.history.back();
          return false;
        }

        if( url.replace($.mobile.path.get(), "") == "#"  ){
          event.preventDefault();
          return;
        }

        //TODO: temporary fix to remove activeBtnClass
        $(".ui-btn."+$.mobile.activeBtnClass).removeClass($.mobile.activeBtnClass);
        $activeClickedLink = $this.closest( ".ui-btn" ).addClass( $.mobile.activeBtnClass );

        if( isExternal || hasAjaxDisabled || hasTarget || !$.mobile.ajaxEnabled ||
          // TODO: deprecated - remove at 1.0
          !$.mobile.ajaxLinksEnabled ){
          //remove active link class if external (then it won't be there if you come back)
          //BUG: removeActiveLinkClass not defined. crap :)
          window.setTimeout(function() {removeActiveLinkClass(true);}, 200);

          if( hasTarget ){
            window.open( url );
          }
          else if( hasAjaxDisabled ){
            return;
          }
          else{
            location.href = url;
          }
        }
        else {
          var transition=$this.data('transition') || undefined,
              direction = $this.data("direction"),
              hash=$currPanel.data('hash'),
              reverse = (direction && direction === "reverse") ||
                        // deprecated - remove by 1.0
                        $this.data( "back" );
          
          $.mobile.nextPageRole = $this.attr( "data-rel" );

          if( $.mobile.path.isRelative( url ) && !hadProtocol ){
            url = $.mobile.path.makeAbsolute( url );
          }

          url = $.mobile.path.stripHash( url );
          
          //if link refers to an already active panel, stop default action and return
          if ($targetPanelActivePage.attr('data-url') == url || $currPanelActivePage.attr('data-url') == url) {
            event.preventDefault();
            return;
          }
          //if link refers to a page on another panel, changePage on that panel
          else if ($targetPanel && $targetPanel!=$this.parents('div[data-role="panel"]')) {
            var from=$targetPanelActivePage;
            $.mobile.pageContainer=$targetContainer;
            $.mobile.changePage([from,url], transition, reverse, true, undefined, $targetContainer);
          }
          //if link refers to a page inside the same panel, changePage on that panel 
          else {
            var from=$currPanelActivePage;
            $.mobile.pageContainer=$currPanel;
            var hashChange= (hash == 'false' || hash == 'crumbs')? false : true;
            $.mobile.changePage([from,url], transition, reverse, hashChange, undefined, $currPanel);
            //active page must always point to the active page in main - for history purposes.
            $.mobile.activePage=$('div[data-id="main"] > div.'+$.mobile.activePageClass);
          }
        }
        event.preventDefault();
      });

      //DONE: bind form submit with this plugin
      $("form").die('submit');
      $("form").live('submit', function(){
        if( !$.mobile.ajaxEnabled ||
          //TODO: deprecated - remove at 1.0
          !$.mobile.ajaxFormsEnabled ||
          $(this).is( "[data-ajax='false']" ) ){ return; }

        var $this = $(this);
            type = $this.attr("method"),
            url = $.mobile.path.clean( $this.attr( "action" ) ),
            $currPanel=$this.parents('div[data-role="panel"]'),
            $currPanelActivePage=$currPanel.children('div.'+$.mobile.activePageClass);

        if( $.mobile.path.isExternal( url ) ){
          return;
        }

        if( $.mobile.path.isRelative( url ) ){
          url = $.mobile.path.makeAbsolute( url );
        }

        //temporarily put this here- eventually shud just set it immediately instead of an interim var.
        $.mobile.activePage=$currPanelActivePage;
        $.mobile.pageContainer=$currPanel;
        $.mobile.changePage({
            url: url,
            type: type || "get",
            data: $this.serialize()
          },
          undefined,
          undefined,
          true
        );
        event.preventDefault();
      });

      //DONE: bind hashchange with this plugin
      //hashchanges are defined only for the main panel - other panels should not support hashchanges to avoid ambiguity
      $(window).unbind("hashchange");
      $(window).bind( "hashchange", function( e, triggered ) {
        var to = $.mobile.path.stripHash( location.hash ),
            transition = $.mobile.urlHistory.stack.length === 0 ? false : undefined,
            $mainPanel=$('div[data-id="main"]'),
            $mainPanelFirstPage=$mainPanel.children('div[data-role="page"]').first(),
            $mainPanelActivePage=$mainPanel.children('div.ui-page-active'),
            $menuPanel=$('div[data-id="menu"]'),
            $menuPanelFirstPage=$menuPanel.children('div[data-role="page"]').first(),
            $menuPanelActivePage=$menuPanel.children('div.ui-page-active'),
            //FIX: temp var for dialogHashKey
            dialogHashKey = "&ui-state=dialog";

        if( !$.mobile.hashListeningEnabled || !$.mobile.urlHistory.ignoreNextHashChange ){
          if( !$.mobile.urlHistory.ignoreNextHashChange ){
            $.mobile.urlHistory.ignoreNextHashChange = true;
          }
          return;
        }

        if( $.mobile.urlHistory.stack.length > 1 &&
            to.indexOf( dialogHashKey ) > -1 &&
            !$.mobile.activePage.is( ".ui-dialog" ) ){

          $.mobile.urlHistory.directHashChange({
            currentUrl: to,
            isBack: function(){ window.history.back(); },
            isForward: function(){ window.history.forward(); }
          });

          return;
        }

        //if to is defined, load it
        if ( to ){
          $.mobile.pageContainer=$menuPanel;
          //if this is initial deep-linked page setup, then changePage sidemenu as well
          if (!$('div.ui-page-active').length) {
            $.mobile.changePage($menuPanelFirstPage, transition, true, false, true);
          }
          $.mobile.pageContainer=$mainPanel;
          $.mobile.activePage=$mainPanelActivePage.length? $mainPanelActivePage : undefined;
          $.mobile.changePage(to, transition, undefined, false, true );
        }
        //there's no hash, go to the first page in the main panel.
        else {
          $.mobile.pageContainer=$mainPanel;
          $.mobile.activePage=$mainPanelActivePage? $mainPanelActivePage : undefined;
          $.mobile.changePage($mainPanelFirstPage, transition, undefined, false, true ); 
        }
      });

      //DONE: bind orientationchange and resize
      $(window).bind('orientationchange resize', function(event){
        var $menu=$('div[data-id="menu"]'),
            $main=$('div[data-id="main"]'),
            $mainHeader=$main.find('div.'+$.mobile.activePageClass+'> div[data-role="header"]'),
            $window=$(window);
        
        function popoverBtn(header) {
          if(!header.children('.popover-btn').length){
            if(header.children('a.ui-btn-left').length){
              header.children('a.ui-btn-left').replaceWith('<a class="popover-btn">Navigation</a>');
              header.children('a.popover-btn').addClass('ui-btn-left').buttonMarkup();
            }
            else{
              header.prepend('<a class="popover-btn">Navigation</a>');
              header.children('a.popover-btn').addClass('ui-btn-left').buttonMarkup()          
            }
          }
        }

        function popover(){
          $menu.addClass('panel-popover')
               .removeClass('sticky-left border-right')
               .css({'width':'25%', 'min-width':'250px', 'display':''});     
          if(!$menu.children('.popover_triangle').length){ 
            $menu.prepend('<div class="popover_triangle"></div>'); 
          }
          $main.removeClass('sticky-right')
               .css('width', '');
          popoverBtn($mainHeader);

          $main.undelegate('div[data-role="page"]', 'pagebeforeshow.splitview');
          $main.delegate('div[data-role="page"]','pagebeforeshow.popover', function(){
            var $thisHeader=$(this).children('div[data-role="header"]');
            popoverBtn($thisHeader);
          });
        };

        function splitView(){
          $menu.removeClass('panel-popover')
               .addClass('sticky-left border-right')
               .css({'width':'25%', 'min-width':'250px', 'display':''});
          $menu.children('.popover_triangle').remove();
          $main.addClass('sticky-right')
               .width(function(){
                 return $(window).width()-$('div[data-id="menu"]').width();  
               });
          $mainHeader.children('.popover-btn').remove();

          $main.undelegate('div[data-role="page"]', 'pagebeforeshow.popover');
          $main.delegate('div[data-role="page"]', 'pagebeforeshow.splitview', function(){
            var $thisHeader=$(this).children('div[data-role="header"]');
            $thisHeader.children('.popover-btn').remove();
          });

        }

        if(event.orientation){
          if(event.orientation == 'portrait'){
            popover();            
          } 
          else if(event.orientation == 'landscape') {
            splitView();
          } 
        }
        else if($window.width() < 768 && $window.width() > 480){
          popover();
        }
        else if($window.width() > 768){
          splitView();
        }
      });

//----------------------------------------------------------------------------------
//Other event bindings: scrollview, popover buttons, and toolbar hacks
//----------------------------------------------------------------------------------

      //DONE: pageshow binding for scrollview
      $('div[data-role="page"]').live('pagebeforeshow.scroll', function(event){
        if ($.support.touch) {
          var $page = $(this);
          $page.find('div[data-role="content"]').attr('data-scroll', 'y');
          $page.find("[data-scroll]:not(.ui-scrollview-clip)").each(function(){
            var $this = $(this);
            // XXX: Remove this check for ui-scrolllistview once we've
            //      integrated list divider support into the main scrollview class.
            if ($this.hasClass("ui-scrolllistview"))
              $this.scrolllistview();
            else
            {
              var st = $this.data("scroll") + "";
              var paging = st && st.search(/^[xy]p$/) != -1;
              var dir = st && st.search(/^[xy]/) != -1 ? st.charAt(0) : null;

              var opts = {};
              if (dir)
                opts.direction = dir;
              if (paging)
                opts.pagingEnabled = true;

              var method = $this.data("scroll-method");
              if (method)
                opts.scrollMethod = method;

              $this.scrollview(opts);
            }
          });
        }
      });

      //data-hash 'crumbs' handler
      //NOTE: if you set data-backbtn to false this WILL not work! will find time to work this thru better.
      $('div[data-role="page"]').live('pagebeforeshow.crumbs', function(event, data){
        var $this = $(this),
            backBtn = $this.find('a[data-rel="back"]');
        if (backBtn.length && ($this.data('hash') == 'crumbs' || $this.parents('div[data-role="panel"]').data('hash') == 'crumbs')) {
          backBtn.removeAttr('data-rel')
                 .attr('href','#'+data.prevPage.attr('data-url'))
                 .jqmData('direction','reverse')
                 .addClass('ui-crumbs');
          backBtn.find('.ui-btn-text').html(data.prevPage.find('div[data-role="header"] .ui-title').html());
        }
      });

      //data-default handler - a page with a link that has a data-default attribute will load that page after this page loads
      //this still needs work - pageTransitionQueue messes everything up.
      $('div:jqmData(role="page")').live('pageshow.context', function(){
        var $this=$(this),
            panelDefaultSelector = $this.parents('div[data-role="panel"]').jqmData('context'),
            pageDefaultSelector = $this.jqmData('context'),
            defaultSelector= pageDefaultSelector ? pageDefaultSelector : panelDefaultSelector;
        if(defaultSelector && $this.find(defaultSelector).length){
          $(defaultSelector).trigger('click');
        }
      });

      //popover button click handler - from http://www.cagintranet.com/archive/create-an-ipad-like-dropdown-popover/
      $('.popover-btn').live('click', function(e){ 
        e.preventDefault(); 
        $('.panel-popover').fadeToggle('fast'); 
        if ($('.popover-btn').hasClass($.mobile.activeBtnClass)) { 
            $('.popover-btn').removeClass($.mobile.activeBtnClass); 
        } else { 
            $('.popover-btn').addClass($.mobile.activeBtnClass); 
        } 
      });

      $('body').live('vclick', function(event) { 
        if (!$(event.target).closest('.panel-popover').length && !$(event.target).closest('.popover-btn').length) { 
            $(".panel-popover").stop(true, true).hide(); 
            $('.popover-btn').removeClass($.mobile.activeBtnClass); 
        }; 
      });

      

      //temporary toolbar mods to present better in tablet/desktop view
      //TODO: API this so that people can specify using data- attributes how they want their toolbars displayed
      //potential toolbar behaviour:
      // 1) has a data-display="top, bottom, inline" attribute
      // 2) 
      $('div[data-id="menu"] div[data-role="page"]').live('pagebeforeshow.splitview', function() {
        $(this).find('div[data-role="footer"] > h2').hide(); 
      });
      $('div[data-id="main"] div[data-role="page"]').live('pagebeforeshow.splitview', function() {
        $(this).find('div[data-role="footer"]').hide();
      });
    }
  });
})(jQuery,window);