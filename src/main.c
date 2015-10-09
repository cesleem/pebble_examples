#include <pebble.h>
  
static Window *s_window;
static TextLayer *s_content_layer;
static char s_content[] = "Cupcake\n\nDonut\n\nEclair\n\nFroyo\n\nGingerbread\n\nHoneycomb\n\nIce Cream Sandwich\n\nJelly Bean\n\nKitKat\n\nLollipop\n\nMarshmallow\n\n";

static DictationSession *s_dictation_session;
// Declare a buffer for the DictationSession
static char s_last_text[512];
DictationSessionStatus status;
char *transcription;

static void dictation_session_callback(DictationSession *session, DictationSessionStatus status, 
              char *transcription, void *context) {
  // Print the results of a transcription attempt                                     
  APP_LOG(APP_LOG_LEVEL_INFO, "Dictation status: %d", (int)status);  
  if (status == DictationSessionStatusSuccess) {
    APP_LOG(APP_LOG_LEVEL_INFO, "Transcription: %s", transcription);
    snprintf(s_last_text, sizeof(s_last_text), "Transcription:\n\n%s", transcription);
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
  
//   if(status == DictationSessionStatusSuccess) {
//     // Display the dictated text
//     snprintf(s_last_text, sizeof(s_last_text), "Transcription:\n\n%s", transcription);
//     text_layer_set_text(s_content_layer, s_last_text);
//   } else {
//     // Display the reason for any error
//     static char s_failed_buff[128];
//     snprintf(s_failed_buff, sizeof(s_failed_buff), "Transcription failed.\n\nReason:\n%d", 
//              (int)status);
//     text_layer_set_text(s_content_layer, s_failed_buff);  
//   }
  
  text_layer_set_text_alignment(s_content_layer, GTextAlignmentCenter);
  text_layer_set_font(s_content_layer, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
  layer_add_child(window_layer, text_layer_get_layer(s_content_layer));
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
}

static void deinit() {
  window_destroy(s_window);
}


int main() {
  init();
  app_event_loop();
  deinit();
}
