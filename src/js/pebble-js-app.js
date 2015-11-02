var myAPIKey = '10f26251ff12540d15cc4724cb05b6db';

var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

function locationSuccess(pos) {
    // Construct URL
  var url = "https://sheetsu.com/apis/410674ca";

  // Send request to OpenWeatherMap
  xhrRequest(url, 'GET', 
    function(responseText) {
      // responseText contains a JSON object with weather info
      var json = JSON.parse(responseText);
  
      console.log(json.result[0].ceslee);
      // // Temperature in Kelvin requires adjustment
      // var temperature = Math.round(json.main.temp - 273.15);
      // console.log("Temperature is " + temperature);

      // // Conditions
      // var conditions = json.weather[0].main;      
      // console.log("Conditions are " + conditions);
      
      // // Assemble dictionary using our keys
      // var dictionary = {
      //   "KEY_TEMPERATURE": temperature,
      //   "KEY_CONDITIONS": conditions
      // };
  // Construct URL
  // var url = "http://api.openweathermap.org/data/2.5/weather?lat=" +
  //     pos.coords.latitude + "&lon=" + pos.coords.longitude + '&appid=' + myAPIKey;

  // Send request to OpenWeatherMap
  // xhrRequest(url, 'GET', 
  //   function(responseText) {
  //     // responseText contains a JSON object with weather info
  //     var json = JSON.parse(responseText);
  
  //     console.log(json);
  //     // Temperature in Kelvin requires adjustment
  //     var temperature = Math.round(json.main.temp - 273.15);
  //     console.log("Temperature is " + temperature);

  //     // Conditions
  //     var conditions = json.weather[0].main;      
  //     console.log("Conditions are " + conditions);
      
  //     // Assemble dictionary using our keys
  //     var dictionary = {
  //       "KEY_TEMPERATURE": temperature,
  //       "KEY_CONDITIONS": conditions
  //     };

      // Send to Pebble
      Pebble.sendAppMessage(dictionary,
        function(e) {
          console.log("Weather info sent to Pebble successfully!");
        },
        function(e) {
          console.log("Error sending weather info to Pebble!");
        }
      );
    }      
  );
}

function locationError(err) {
  console.log("Error requesting location!");
}

function getWeather() {
  navigator.geolocation.getCurrentPosition(
    locationSuccess,
    locationError,
    {timeout: 15000, maximumAge: 60000}
  );
}

// Listen for when the watchface is opened
Pebble.addEventListener('ready', 
  function(e) {
    console.log("PebbleKit JS ready Ceslee you GO GIRL!");

    // Get the initial weather
    getWeather();
  }
);

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage',
  function(e) {
    console.log("AppMessage received!");
    getWeather();
  }                     
);


// #include <pebble.h>

// #define KEY_TEMPERATURE 0
// #define KEY_CONDITIONS 1
  
// static Window *s_window;
// static TextLayer *s_content_layer;

// // Store incoming information
// static char temperature_buffer[8];
// static char conditions_buffer[32];

// static DictationSession *s_dictation_session;
// // Declare a buffer for the DictationSession
// static char s_last_text[512];
// DictationSessionStatus status;
// char *transcription;

// static void inbox_received_callback(DictionaryIterator *iterator, void *context) {


//   // Read first item
//   Tuple *t = dict_read_first(iterator);

//   // For all items
//   while(t != NULL) {
//     // Which key was received?
//     switch(t->key) {
//     case KEY_TEMPERATURE:
//       snprintf(temperature_buffer, sizeof(temperature_buffer), "%dC", (int)t->value->int32);
//       break;
//     case KEY_CONDITIONS:
//       snprintf(conditions_buffer, sizeof(conditions_buffer), "%s", t->value->cstring);
//       break;
//     default:
//       APP_LOG(APP_LOG_LEVEL_ERROR, "Key %d not recognized!", (int)t->key);
//       break;
//     }

//     // Look for next item
//     t = dict_read_next(iterator);
//   }
// }


// static void inbox_dropped_callback(AppMessageResult reason, void *context) {
//   APP_LOG(APP_LOG_LEVEL_ERROR, "Message dropped!");
// }

// static void outbox_failed_callback(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
//   APP_LOG(APP_LOG_LEVEL_ERROR, "Outbox send failed!");
// }

// static void outbox_sent_callback(DictionaryIterator *iterator, void *context) {
//   APP_LOG(APP_LOG_LEVEL_INFO, "Outbox send success!");
// }


// static void dictation_session_callback(DictationSession *session, DictationSessionStatus status, 
//               char *transcription, void *context) {
//   // Print the results of a transcription attempt                                     
//   APP_LOG(APP_LOG_LEVEL_INFO, "Dictation status: %d", (int)status);  
//   if (status == DictationSessionStatusSuccess) {
//     APP_LOG(APP_LOG_LEVEL_INFO, "Transcription: %s", transcription);
//     snprintf(s_last_text, sizeof(s_last_text), "Transcription:\n\n%s, %s, %s", transcription, temperature_buffer, conditions_buffer);
//     text_layer_set_text(s_content_layer, s_last_text);
//   }
// }

// static void window_load(Window *window) {

//   Layer *window_layer = window_get_root_layer(window);
//   GRect bounds = layer_get_bounds(window_layer);
  
//   s_content_layer = text_layer_create(GRect(bounds.origin.x, bounds.origin.y, bounds.size.w, 2000));
  
  
//   // Create new dictation session
//   s_dictation_session = dictation_session_create(sizeof(s_last_text), dictation_session_callback, NULL);
//   if (!s_dictation_session) {
//     APP_LOG(APP_LOG_LEVEL_INFO, "Couldn't create dictation");
//   }
  
//   // Start dictation UI
//   if (dictation_session_start(s_dictation_session) != DictationSessionStatusSuccess) {
//     APP_LOG(APP_LOG_LEVEL_INFO, "Couldn't start dictation");
//   }
  
//   text_layer_set_text_alignment(s_content_layer, GTextAlignmentCenter);
//   text_layer_set_font(s_content_layer, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
//   layer_add_child(window_layer, text_layer_get_layer(s_content_layer));
//   APP_LOG(APP_LOG_LEVEL_INFO, "Main window loaded.");
// }


// static void window_unload(Window *window) {
//   text_layer_destroy(s_content_layer);
// }

// static void init() {
//   s_window = window_create();
//   window_set_window_handlers(s_window, (WindowHandlers) {
//     .load = window_load,
//     .unload = window_unload,
//   });
//   window_stack_push(s_window, true);
//   // Register callbacks
//   app_message_register_inbox_received(inbox_received_callback);
//   app_message_register_inbox_dropped(inbox_dropped_callback);
//   app_message_register_outbox_failed(outbox_failed_callback);
//   app_message_register_outbox_sent(outbox_sent_callback);
//   // Open AppMessage
//   app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
// }


// static void deinit() {
//   window_destroy(s_window);
// }


// int main() {
//   init();
//   app_event_loop();
//   deinit();
// }

// // #include <pebble.h>

// #define KEY_TEMPERATURE 0
// #define KEY_CONDITIONS 1

// static Window *s_main_window;
// static TextLayer *s_time_layer;
// static TextLayer *s_weather_layer;

// static BitmapLayer *s_background_layer;
// static GBitmap *s_background_bitmap;

// static GFont s_time_font;
// static GFont s_weather_font;

// static void inbox_received_callback(DictionaryIterator *iterator, void *context) {
//   // Store incoming information
//   static char temperature_buffer[8];
//   static char conditions_buffer[32];
//   static char weather_layer_buffer[32];

//   // Read tuples for data
//   Tuple *temp_tuple = dict_find(iterator, KEY_TEMPERATURE);
//   Tuple *conditions_tuple = dict_find(iterator, KEY_CONDITIONS);

//   // If all data is available, use it
//   if(temp_tuple && conditions_tuple) {
//     snprintf(temperature_buffer, sizeof(temperature_buffer), "%dC", (int)temp_tuple->value->int32);
//     snprintf(conditions_buffer, sizeof(conditions_buffer), "%s", conditions_tuple->value->cstring);

//     // Assemble full string and display
//     snprintf(weather_layer_buffer, sizeof(weather_layer_buffer), "%s, %s", temperature_buffer, conditions_buffer);
//     text_layer_set_text(s_weather_layer, weather_layer_buffer);
//   }
// }

// static void inbox_dropped_callback(AppMessageResult reason, void *context) {
//   APP_LOG(APP_LOG_LEVEL_ERROR, "Message dropped!");
// }

// static void outbox_failed_callback(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
//   APP_LOG(APP_LOG_LEVEL_ERROR, "Outbox send failed!");
// }

// static void outbox_sent_callback(DictionaryIterator *iterator, void *context) {
//   APP_LOG(APP_LOG_LEVEL_INFO, "Outbox send success!");
// }

// static void update_time() {
//   // Get a tm structure
//   time_t temp = time(NULL); 
//   struct tm *tick_time = localtime(&temp);

//   // Write the current hours and minutes into a buffer
//   static char s_buffer[8];
//   strftime(s_buffer, sizeof(s_buffer), clock_is_24h_style() ?
//                                           "%H:%M" : "%I:%M", tick_time);

//   // Display this time on the TextLayer
//   text_layer_set_text(s_time_layer, s_buffer);
// }

// static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
//   update_time();

//   // Get weather update every 30 minutes
//   if(tick_time->tm_min % 30 == 0) {
//     // Begin dictionary
//     DictionaryIterator *iter;
//     app_message_outbox_begin(&iter);

//     // Add a key-value pair
//     dict_write_uint8(iter, 0, 0);

//     // Send the message!
//     app_message_outbox_send();
//   }
// }

// static void main_window_load(Window *window) {
//   // Get information about the Window
//   Layer *window_layer = window_get_root_layer(window);
//   GRect bounds = layer_get_bounds(window_layer);

// //   // Create GBitmap
// //   s_background_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_BACKGROUND);

// //   // Create BitmapLayer to display the GBitmap
// //   s_background_layer = bitmap_layer_create(bounds);

// //   // Set the bitmap onto the layer and add to the window
// //   bitmap_layer_set_bitmap(s_background_layer, s_background_bitmap);
// //   layer_add_child(window_layer, bitmap_layer_get_layer(s_background_layer));

// //   // Create the TextLayer with specific bounds
// //   s_time_layer = text_layer_create(
// //       GRect(0, PBL_IF_ROUND_ELSE(58, 52), bounds.size.w, 50));

// //   // Improve the layout to be more like a watchface
// //   text_layer_set_background_color(s_time_layer, GColorClear);
// //   text_layer_set_text_color(s_time_layer, GColorBlack);
// //   text_layer_set_text(s_time_layer, "00:00");
// //   text_layer_set_text_alignment(s_time_layer, GTextAlignmentCenter);

// //   // Create GFont
// //   s_time_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_PERFECT_DOS_48));

// //   // Apply to TextLayer
// //   text_layer_set_font(s_time_layer, s_time_font);

// //   // Add it as a child layer to the Window's root layer
// //   layer_add_child(window_layer, text_layer_get_layer(s_time_layer));

// //   // Create temperature Layer
// //   s_weather_layer = text_layer_create(
// //       GRect(0, PBL_IF_ROUND_ELSE(125, 120), bounds.size.w, 25));

// //   // Style the text
// //   text_layer_set_background_color(s_weather_layer, GColorClear);
// //   text_layer_set_text_color(s_weather_layer, GColorWhite);
// //   text_layer_set_text_alignment(s_weather_layer, GTextAlignmentCenter);
// //   text_layer_set_text(s_weather_layer, "Loading...");

// //   // Create second custom font, apply it and add to Window
// //   s_weather_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_PERFECT_DOS_20));
// //   text_layer_set_font(s_weather_layer, s_weather_font);
// //   layer_add_child(window_get_root_layer(window), text_layer_get_layer(s_weather_layer));
// }

// static void main_window_unload(Window *window) {
//   // Destroy TextLayer
//   text_layer_destroy(s_time_layer);

// //   // Unload GFont
// //   fonts_unload_custom_font(s_time_font);

// //   // Destroy GBitmap
// //   gbitmap_destroy(s_background_bitmap);

// //   // Destroy BitmapLayer
// //   bitmap_layer_destroy(s_background_layer);

// //   // Destroy weather elements
// //   text_layer_destroy(s_weather_layer);
// //   fonts_unload_custom_font(s_weather_font);
// }


// static void init() {
//   // Create main Window element and assign to pointer
//   s_main_window = window_create();

//   // Set the background color
//   window_set_background_color(s_main_window, GColorBlack);

//   // Set handlers to manage the elements inside the Window
//   window_set_window_handlers(s_main_window, (WindowHandlers) {
//     .load = main_window_load,
//     .unload = main_window_unload
//   });

//   // Show the Window on the watch, with animated=true
//   window_stack_push(s_main_window, true);

//   // Make sure the time is displayed from the start
//   update_time();

//   // Register with TickTimerService
//   tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);

//   // Register callbacks
//   app_message_register_inbox_received(inbox_received_callback);
//   app_message_register_inbox_dropped(inbox_dropped_callback);
//   app_message_register_outbox_failed(outbox_failed_callback);
//   app_message_register_outbox_sent(outbox_sent_callback);

//   // Open AppMessage
//   app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
// }

// static void deinit() {
//   // Destroy Window
//   window_destroy(s_main_window);
// }

// int main(void) {
//   init();
//   app_event_loop();
//   deinit();
// }