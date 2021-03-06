/* Configure timeline settings from website options
* ================================================== */
function getUrlVars(string) {
  var vars = [],
    hash,
    hashes,
    str = string.toString();

  if (str.match('&#038;')) {
    str = str.replace("&#038;", "&");
  } else if (str.match('&#38;')) {
    str = str.replace("&#38;", "&");
  } else if (str.match('&amp;')) {
    str = str.replace("&amp;", "&");
  }
  if (str.match('#')) {
    str = str.split('#')[0];
  }
  hashes = str.slice(str.indexOf('?') + 1).split('&');

  for(var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }

  return vars;
};

function getLinkAndIframe() {

  var theobj = {},
    e_source = document.getElementById('embed-source-url'),
    e_width = document.getElementById('embed-width'),
    e_height = document.getElementById('embed-height'),
    e_language = document.getElementById('embed-language'),
    e_embed = document.getElementById('embed_code'),
    e_font = document.getElementById('embed-font-active'),
    e_startatend = document.getElementById('embed-startatend'),
    e_timenav_top = document.getElementById('embed-timenavtop'),
    e_startatslide = document.getElementById('embed-startatslide'),
    e_debug = document.getElementById('embed-debug'),
    initial_zoom = document.getElementById('embed-initialzoom'),
    timenav_position = "bottom",
    start_at_end = false,
    is_debug = false,
    iframe,
    link,
    vars,
    wp,
    source_key;

  /* SOURCE KEY
  ================================================== */
  if (e_source.value.match("docs.google.com")) {
    var obj = VCO.ConfigFactory.parseGoogleSpreadsheetURL(e_source.value);
    source_key = obj.key;
  } else {
    if (e_source.value == "") {
      source_key  = document.getElementById('embed-source-url').getAttribute("placeholder");
    } else {
      source_key  = e_source.value;
    }
  }

  /* MISC
  ================================================== */
  if (e_startatend.checked) {
    start_at_end = true;
  }

  if (e_timenav_top.checked) {
    timenav_position = "top";
  }

  if (e_debug.checked) {
    is_debug = true;
  }

  /* IFRAME AND LINK
  ================================================== */
  vars    =  generator_embed_path + "?source=" + source_key;
  vars    += "&font=" + e_font.dataset.value;
  vars    += "&lang=" + e_language.value;
  if (start_at_end) {
    vars  += "&start_at_end=" + start_at_end;
  }
  if (timenav_position == "top") {
    vars += "&timenav_position=" + timenav_position;
  }
  if (is_debug) {
    vars  += "&debug=" + is_debug;
  }
  if (initial_zoom) {
    vars += "&initial_zoom=" + initial_zoom.value;
  }
  // TODO: Make this start at end if startatslide > # of slides
  if (parseInt(e_startatslide.value, 10) > 0) {
    vars  += "&start_at_slide=" + parseInt(e_startatslide.value, 10);
  }

  if (e_width.value > 0) {
    vars  += "&width=" + e_width.value;
  }
  if (e_height.value > 0) {
    vars  += "&height=" + e_height.value;
  }

  iframe    = "<iframe src='" + vars + "'";

  if (e_width.value > 0 || e_width.value.match("%")) {
    iframe  += " width='" + e_width.value + "'";
  }
  if (e_height.value > 0 || e_height.value.match("%")) {
    iframe  += " height='" + e_height.value + "'";
  }
  iframe    += " frameborder='0'></iframe>";

  theobj.iframe = iframe;
  theobj.link   = vars;
  theobj.copybox = iframe;
  return theobj;
};

/* EMBED GENERATOR
================================================== */
function updateEmbedCode(element, options) {
  var e_embed = document.getElementById('embed_code'),
    el = getLinkAndIframe();
  e_embed.value = el.copybox;
  jQuery("#preview-embed-link").attr('href', el.link);
  jQuery("#preview-embed-iframe").html(el.iframe);
  if (jQuery("#preview-embed").css("display") == "none"){
    jQuery("#preview-embed").css("display","block");
  }
}



var $ = jQuery;
$(document).ready(function() {
  function navSmartScroll($destination) {
    var offset = $(".navbar").height() || 0,
        scrollTop = $destination.offset().top;
    $("body,html").animate({scrollTop: scrollTop}, 350);
  }

  // Navbar scrollTo
  $(".navbar .nav a, [data-scroll='true']").click(function (e) {
    var $target = $(this)
      , href = $target.attr("href")
      , hash = href.substring(href.lastIndexOf('#'))
      , $destination = $(hash);
    // fix for unpredictable scrolling behaviour on #preview-embed
    if ($destination.css("display") == "none") {
      $destination.css("display", "block");
      $destination = $destination.parent();
    }
    navSmartScroll($destination);

    return false;
  });

  // More Options
  $(".show-options").click(function (e) {
    $(this).hide();
    $(".hide-options").show();
    $(".more-options").slideDown();
    return false;
  });

  $(".hide-options").click(function (e) {
    $(this).hide();
    $(".show-options").show();
    $(".more-options").slideUp();
    return false;
  });

  // Preview
  $("#iframe-preview-button").click(function () {
    var $embed = $("#preview");

    $embed.show();

    // Need to 'reload' the iframe to get it to display correctly
    var $if = $("#preview iframe");
    $if.attr("src", $if.attr("src"));
    //$("body,html").animate({scrollTop: $embed.offset().top - 60}, 250);
  });

  // Device preview
  $('#device-preview-mode span').on("click", function(){
    $("#preview-embed-iframe").removeClass();
    $("#preview-embed-iframe").addClass($(this).data("size"));
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
  });

  // Embed Generator
  updateEmbedCode();
  $("#embed_code").click(function() { $(this).select(); });
  $('#embed-width').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-height').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-maptype').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-source-url').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-language').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-startatend').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-timenavtop').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-startatslide').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-width').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-initialzoom').change(function(evt) { updateEmbedCode(evt); });
  $("#embed-font li").on("click", function(evt){
    var currentFont = document.getElementById("embed-font-active");
    currentFont.removeChild(currentFont.firstChild);
    currentFont.removeAttribute("id");
    $(this).attr("id", "embed-font-active")
           .prepend('<i class="fa fa-check"></i>');
    var fontPair = $(this).data("value");
    $("#font-pair-preview").attr("src", "static/img/make/" + fontPair.toLowerCase() + ".png")
                           .attr("alt", fontPair );
    $("ul#embed-font").hide();
    updateEmbedCode(evt);
  });
  $("#embed-font-dropdown a, #font-pair-preview").on("click", function(evt){
      evt.preventDefault();
      $("ul#embed-font").toggle();
  });
  $('.collapse').on('show',function(e) {
    window.location.hash = "show-" + $(this).attr('id');
  })

  if (window.location.hash.match(/#show-/)) {
    var $target = $("#" + window.location.hash.substr(6));
    $target.collapse('show');
    navSmartScroll($target.prev());
  }
});
