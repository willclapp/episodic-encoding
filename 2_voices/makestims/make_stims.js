let num_practice = 4;
let num_memload = 4;
let num_exp = 4;

let audio_data = {
    ID: 0,
    Presentation: 'UNKNOWN',
    Recording: 0,
    Order: 0,
    Phase: 'UNKNOWN', 
    Talker: 'UNKNOWN', 
    Same_Talker: false,
    Word: 'UNKNOWN', 
    num_voices: 0, 
    Buttons: 'UNKNOWN', 
    Presentation: 'UNKNOWN', 
    Recording: 0, 
    token_repeated: false,
}

let audio_temp = {
    stimulus: 'UNKNOWN', 
    type: 'audio-keyboard-response', 
    prompt: 'UNKNOWN', 
    trial_ends_after_audio: true, 
    post_trial_gap: 0, 
    response_allowed_while_playing: false, 
    data: {}
}

let response_data = {
    Order: 0,
    Phase: 'UNKNOWN', 
    ID: 0,
    Talker: 'UNKNOWN', 
    Same_Talker: false,
    Word: 'UNKNOWN', 
    num_voices: 0, 
    Buttons: 'UNKNOWN',
    Presentation: 'UNKNOWN', 
    Recording: 0, 
    token_repeated: false,
    case: 'UNKNOWN'
}

let response_temp = {
    type: 'html-keyboard-response', 
    choices: ['f', 'j'], 
    stimulus: 'UNKNOWN', 
    trial_duration: 4000, 
    post_trial_gap: 0, 
    data: {},
    on_finish: function(data) {
        // uncomment next line to see the result of each trial
        // console.log(data.key_press);
        if (data.Phase == 'practice') {
                jsPsych.setProgressBar(data.Order / (num_practice * 2));
            } else if (data.Phase == 'memload') {
                jsPsych.setProgressBar(data.Order / ((num_memload + num_exp) * 2));
            } else {
                jsPsych.setProgressBar((data.Order + num_memload + 1) / ((num_memload + num_exp) * 2));
            }
        let correct_response;
        if (data.Buttons == 'NEW_OLD') {
            if (data.Presentation == 'NEW') {
                correct_response = 70;
            } else {
                correct_response = 74;
            }
        } else if (data.Buttons == 'OLD_NEW') {
            if (data.Presentation == 'NEW') {
                correct_response = 74;
            } else {
                correct_response = 70;
            }
        }
        if (data.key_press == null) {
            data.correct = false;
            data.case = 'NO_RESPONSE'
        } else {
            if(correct_response == data.key_press) {
                data.correct = true;
            } else {
                data.correct = false; 
            }
            if (data.Presentation == 'OLD') {
                if (data.correct) {
                    data.case = 'HIT';
                } else {
                    data.case = 'MISS';
                }
            } else {
                if (data.correct) {
                    data.case = 'CORRECT_REJECTION';
                } else {
                    data.case = 'FALSE_ALARM';
                }          
            }
        }
    }
}

// Create random test orders
let practice_order = createArray(num_practice * 2);
let practice_lag_list = createPracticeLagList(num_practice);
let practice_id_list = getIds(word_ids, 0, num_practice);
practice_order = assignTrials(practice_order, practice_lag_list, practice_id_list);

let memload_order = createArray(num_memload * 2);
let memload_lag_list = createMemloadLagList(num_memload);
let memload_id_list = getIds(word_ids, num_practice, num_practice + num_memload);
memload_order = assignTrials(memload_order, memload_lag_list, memload_id_list);

let exp_order = createArray(num_exp * 2);
let exp_lag_list = createExpLagList(num_exp);
let exp_id_list = getIds(word_ids, num_practice + num_memload, num_practice + num_memload + num_exp);
exp_order = assignTrials(exp_order, exp_lag_list, exp_id_list);
checkDistribution(exp_order);

// Set the talker for each new trial
let poss = ["Same_M1", "Same_M2", "Diff_M1", "Diff_M2"];
let practice_talker_order = shuffle(generateTalkerOrder(practice_id_list, talker_ids));
let memload_talker_order = shuffle(generateTalkerOrder(memload_id_list, talker_ids));
let exp_talker_order = shuffle(generateTalkerOrder(exp_id_list, talker_ids));

// generate the trial objects
let practice_audio_objects = [];
let practice_response_objects = [];
let memload_audio_objects = [];
let memload_response_objects = [];
let exp_audio_objects = [];
let exp_response_objects = [];

generateBlankTrials(practice_audio_objects, practice_response_objects, num_practice, audio_temp, response_temp, audio_data, response_data);
generateTrials(practice_order, practice_talker_order,
   practice_audio_objects, audio_temp,
   practice_response_objects, response_temp, "practice");

generateBlankTrials(memload_audio_objects, memload_response_objects, num_memload, audio_temp, response_temp, audio_data, response_data);
generateTrials(memload_order, memload_talker_order,
   memload_audio_objects, audio_temp,
   memload_response_objects, response_temp, "memload");

generateBlankTrials(exp_audio_objects, exp_response_objects, num_exp, audio_temp, response_temp, audio_data, response_data);
generateTrials(exp_order, exp_talker_order,
   exp_audio_objects, audio_temp,
   exp_response_objects, response_temp, "exp");