#include <pebble.h>

#define KEY_TEMPERATURE 0
#define KEY_CONDITIONS 1
  
static Window *s_window;
static TextLayer *s_content_layer;

// Store incoming information
static char temperature_buffer[8];
static char conditions_buffer[32];

static DictationSession *s_dictation_session;
// Declare a buffer for the DictationSession
static char s_last_text[512];
DictationSessionStatus status;
char *transcription;

static void inbox_received_callback(DictionaryIterator *iterator, void *context) {


  // Read first item
  Tuple *t = dict_read_first(iterator);

  // For all items
  while(t != NULL) {
    // Which key was received?
    switch(t->key) {
    case KEY_TEMPERATURE:
      snprintf(temperathahaure_buffer, sizeof(temperature_buffer), "%dC", (int)t->value->int32);
      break;
    case KEY_CONDITIONS:
      snprintf(conditions_buffer, sizeof(conditions_buffer), "%s", t->value->cstring);
      break;
    default:
      APP_LOG(APP_LOG_LEVEL_ERROR, "Key %d not recognized!", (int)t->key);
      break;
    }

    // Look for next item
    t = dict_read_next(iterator);
  }
}


static void inbox_dropped_callback(AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Message dropped!");
}

static void outbox_failed_callback(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Outbox send failed!");
}

static void outbox_sent_callback(DictionaryIterator *iterator, void *context) {
  APP_LOG(APP_LOG_LEVEL_INFO, "Outbox send success!");
}


static void dictation_session_callback(DictationSession *session, DictationSessionStatus status, 
              char *transcription, void *context) {
  // Print the results of a transcription attempt                                     
  APP_LOG(APP_LOG_LEVEL_INFO, "Dictation status: %d", (int)status);  
  if (status == DictationSessionStatusSuccess) {
    APP_LOG(APP_LOG_LEVEL_INFO, "Transcription: %s", transcription);
    snprintf(s_last_text, sizeof(s_last_text), "Transcription:\n\n%s, %s, %s", transcription, temperature_buffer, conditions_buffer);
    text_layer_set_text(s_content_layer, s_last_text);
  }
}

static void window_load(Window *window) {

  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);
  
  s_content_layer = text_layer_create(GRect(bounds.origin.x, bounds.origin.y, bounds.size.w, 2000));
  
  
  // Create new dictation session
  s_dictation_session = dictation_session_create(sizeof(s_last_text), dictation_session_callback, NULL);
  if (!s_dictation_session) {
    APP_LOG(APP_LOG_LEVEL_INFO, "Couldn't create dictation");
  }
  
  // Start dictation UI
  if (dictation_session_start(s_dictation_session) != DictationSessionStatusSuccess) {
    APP_LOG(APP_LOG_LEVEL_INFO, "Couldn't start dictation");
  }
  
  text_layer_set_text_alignment(s_content_layer, GTextAlignmentCenter);
  text_layer_set_font(s_content_layer, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
  layer_add_child(window_layer, text_layer_get_layer(s_content_layer));
  APP_LOG(APP_LOG_LEVEL_INFO, "Main window loaded.");
}


static void window_unload(Window *window) {
  text_layer_destroy(s_content_layer);
}

static void init() {
  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
  window_stack_push(s_window, true);
  // Register callbacks
  app_message_register_inbox_received(inbox_received_callback);
  app_message_register_inbox_dropped(inbox_dropped_callback);
  app_message_register_outbox_failed(outbox_failed_callback);
  app_message_register_outbox_sent(outbox_sent_callback);
  // Open AppMessage
  app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
}


static void deinit() {
  window_destroy(s_window);
}


int main() {
  init();
  app_event_loop();
  deinit();
}
