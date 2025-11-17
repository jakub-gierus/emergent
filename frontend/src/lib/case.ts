import { execute, query } from './db';

let isLoading = false;
let isLoaded = false;

export async function loadRiverbankCase(): Promise<void> {
  if (isLoaded) {
    console.log('Case already loaded');
    return;
  }

  if (isLoading) {
    console.log('Case is currently loading, waiting...');
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  isLoading = true;

  try {
    const existingLocations = await query('SELECT COUNT(*) as count FROM locations');
    if (existingLocations.length > 0 && existingLocations[0].count > 0) {
      console.log('Case already loaded in database');
      isLoaded = true;
      isLoading = false;
      return;
    }
  } catch (err) {
    console.log('Tables not yet initialized, proceeding with case load');
  }

  try {
    await execute(`DELETE FROM timeline_events`);
    await execute(`DELETE FROM interviews`);
    await execute(`DELETE FROM relationships`);
    await execute(`DELETE FROM evidence`);
    await execute(`DELETE FROM people`);
    await execute(`DELETE FROM game_state`);
    await execute(`DELETE FROM locations`);

    await execute(`
      INSERT INTO locations VALUES
      ('LOC001', 'Riverside Park', 'park', '123 River Road'),
      ('LOC002', 'Chen Residence', 'residential', '45 Oak Street'),
      ('LOC003', 'Webb Residence', 'residential', '78 Maple Drive'),
      ('LOC004', 'Town Library', 'commercial', '12 Main Street'),
      ('LOC005', 'Miller''s Bar', 'commercial', '56 Downtown Ave'),
      ('LOC006', 'Elmwood Apartments', 'residential', '89 Elm Street'),
      ('LOC007', 'Gas Station', 'commercial', '34 Highway 9'),
      ('LOC008', 'School', 'institutional', '100 Education Lane'),
      ('LOC009', 'Home Depot', 'commercial', '200 Industrial Blvd'),
      ('LOC010', 'Cemetery', 'other', '15 Memorial Drive');
    `);

    await execute(`
      INSERT INTO people VALUES
      ('P001', 'Margaret Chen', 42, 'Librarian', '45 Oak Street', 'middle_class', 'organized, kind, anxious'),
      ('P002', 'Thomas Webb', 45, 'Construction Worker', '78 Maple Drive', 'working_class', 'aggressive, controlling, resentful'),
      ('P003', 'Sarah Webb', 12, 'Student', '78 Maple Drive', 'dependent', 'quiet, observant, traumatized'),
      ('P004', 'Jason Pierce', 28, 'Unemployed', '89 Elm Street Apt 3B', 'poor', 'anxious, paranoid, addict'),
      ('P005', 'Linda Morrison', 38, 'Nurse', '67 Pine Court', 'middle_class', 'calm, observant, helpful'),
      ('P006', 'David Chen', 44, 'Accountant', '45 Oak Street', 'middle_class', 'grieving, suspicious, protective'),
      ('P007', 'Rachel Webb', 32, 'Waitress', '78 Maple Drive', 'working_class', 'naive, loyal, conflicted'),
      ('P008', 'Frank Miller', 58, 'Bar Owner', '56 Downtown Ave', 'middle_class', 'gruff, observant, discrete'),
      ('P009', 'Emma Rodriguez', 35, 'Teacher', '22 School Lane', 'middle_class', 'caring, professional, concerned'),
      ('P010', 'Officer Jake Wilson', 29, 'Police Officer', '88 Station Road', 'middle_class', 'eager, inexperienced, loyal'),
      ('P011', 'Mary Sullivan', 65, 'Retired', '91 Oak Street', 'middle_class', 'nosy, talkative, sharp'),
      ('P012', 'Carlos Mendez', 51, 'Landscaper', '44 Vista Drive', 'working_class', 'hardworking, quiet, observant'),
      ('P013', 'Jennifer Lake', 39, 'Real Estate Agent', '123 Lakeview', 'upper_middle_class', 'ambitious, charming, secretive'),
      ('P014', 'Robert Hayes', 47, 'Hardware Store Owner', '200 Industrial Blvd', 'middle_class', 'practical, helpful, curious'),
      ('P015', 'Detective Sam Porter', 52, 'Detective', '88 Station Road', 'middle_class', 'experienced, methodical, patient');
    `);

    await execute(`
      INSERT INTO relationships VALUES
      ('R001', 'P001', 'P002', 'ex_spouse', -8.5, ARRAY['custody_battle', 'bitter_divorce', 'financial_dispute']),
      ('R002', 'P001', 'P006', 'spouse', 9.2, ARRAY['loving_marriage']),
      ('R003', 'P001', 'P003', 'mother', 8.5, ARRAY['protective']),
      ('R004', 'P002', 'P003', 'father', 6.0, ARRAY['custody_fight']),
      ('R005', 'P002', 'P007', 'girlfriend', 7.5, ARRAY['she_provides_alibi']),
      ('R006', 'P004', 'P001', 'acquaintance', 2.0, ARRAY['library_regular']),
      ('R007', 'P005', 'P001', 'friend', 6.5, ARRAY['jogging_partners']),
      ('R008', 'P009', 'P003', 'teacher', 7.0, ARRAY['concerned_about_home_life']),
      ('R009', 'P011', 'P001', 'neighbor', 5.0, ARRAY['sees_everything']),
      ('R010', 'P011', 'P002', 'observer', 3.0, ARRAY['saw_him_leave']),
      ('R011', 'P001', 'P013', 'acquaintance', -3.5, ARRAY['library_board_dispute']),
      ('R012', 'P002', 'P014', 'customer', 4.0, ARRAY['recent_purchase']);
    `);

    await execute(`
      INSERT INTO timeline_events VALUES
      ('E001', 'P001', '2024-03-15 17:30:00', 'LOC004', 'Closing library', ARRAY['P009'], ARRAY[], TRUE, 'CCTV'),
      ('E002', 'P001', '2024-03-15 17:45:00', 'LOC004', 'Left library', ARRAY[], ARRAY[], TRUE, 'CCTV'),
      ('E003', 'P001', '2024-03-15 18:00:00', 'LOC002', 'Arrived home', ARRAY['P006'], ARRAY[], TRUE, 'Husband'),
      ('E004', 'P001', '2024-03-15 18:30:00', 'LOC002', 'Changed into jogging clothes', ARRAY['P006'], ARRAY[], TRUE, 'Husband'),
      ('E005', 'P001', '2024-03-15 18:45:00', 'LOC002', 'Left for jog', ARRAY['P006', 'P011'], ARRAY[], TRUE, 'Multiple witnesses'),
      ('E006', 'P001', '2024-03-15 19:00:00', 'LOC001', 'Jogging in park', ARRAY['P005', 'P012'], ARRAY[], TRUE, 'Witnesses'),
      ('E007', 'P001', '2024-03-15 19:15:00', 'LOC001', 'Found dead near trail', ARRAY[], ARRAY['EV001', 'EV002'], TRUE, 'Crime scene'),
      ('E008', 'P002', '2024-03-15 18:00:00', 'LOC003', 'At home with girlfriend', ARRAY['P007'], ARRAY[], FALSE, 'Girlfriend alibi'),
      ('E009', 'P002', '2024-03-15 18:30:00', 'LOC003', 'Left house', ARRAY['P011'], ARRAY[], TRUE, 'Neighbor'),
      ('E010', 'P002', '2024-03-15 19:10:00', 'LOC001', 'Near park entrance', ARRAY[], ARRAY[], TRUE, 'Security camera'),
      ('E011', 'P002', '2024-03-15 19:45:00', 'LOC003', 'Returned home', ARRAY['P007'], ARRAY[], TRUE, 'Girlfriend'),
      ('E012', 'P004', '2024-03-15 19:20:00', 'LOC001', 'Running from park', ARRAY['P012', 'P005'], ARRAY[], TRUE, 'Multiple witnesses'),
      ('E013', 'P005', '2024-03-15 19:00:00', 'LOC001', 'Jogging in park', ARRAY['P001', 'P012'], ARRAY[], TRUE, 'Self-report'),
      ('E014', 'P005', '2024-03-15 19:20:00', 'LOC001', 'Heard scream', ARRAY['P012'], ARRAY[], TRUE, 'Self-report'),
      ('E015', 'P007', '2024-03-15 18:00:00', 'LOC005', 'Working at bar', ARRAY['P008'], ARRAY[], TRUE, 'Boss'),
      ('E016', 'P007', '2024-03-15 18:30:00', 'LOC005', 'Left work early', ARRAY['P008'], ARRAY[], TRUE, 'Boss'),
      ('E017', 'P012', '2024-03-15 19:05:00', 'LOC001', 'Working in park', ARRAY['P001', 'P005'], ARRAY[], TRUE, 'Self-report'),
      ('E018', 'P003', '2024-03-15 18:00:00', 'LOC003', 'Doing homework', ARRAY['P002', 'P007'], ARRAY[], TRUE, 'Parents'),
      ('E019', 'P002', '2024-03-18 14:30:00', 'LOC009', 'Purchased hiking boots', ARRAY[], ARRAY['EV006'], TRUE, 'Receipt'),
      ('E020', 'P006', '2024-03-15 19:30:00', 'LOC001', 'Discovered body, called 911', ARRAY[], ARRAY[], TRUE, '911 call');
    `);

    await execute(`
      INSERT INTO evidence VALUES
      ('EV001', 'physical', 'LOC001', 'Rock with blood and hair, used as weapon', NULL, FALSE, NULL, FALSE, TRUE),
      ('EV002', 'physical', 'LOC001', 'Victim''s phone, screen cracked', NULL, FALSE, NULL, FALSE, TRUE),
      ('EV003', 'digital', 'LOC001', 'Security camera footage showing vehicle near park at 6:55pm', NULL, TRUE, 'Thomas Webb''s truck visible', FALSE, TRUE),
      ('EV004', 'digital', 'LOC002', 'Victim''s phone GPS data', NULL, FALSE, NULL, TRUE, FALSE),
      ('EV005', 'testimonial', 'LOC011', 'Neighbor saw Thomas leave house at 6:30pm', NULL, TRUE, 'Contradicts alibi', FALSE, TRUE),
      ('EV006', 'physical', 'LOC009', 'Receipt for new hiking boots purchased 3 days after murder', NULL, TRUE, 'Suggests disposal of evidence', FALSE, TRUE),
      ('EV007', 'testimonial', 'LOC008', 'Daughter''s school essay mentioning parents fighting about money', NULL, FALSE, NULL, TRUE, FALSE),
      ('EV008', 'physical', 'LOC001', 'Partial shoe print in mud near scene', NULL, FALSE, NULL, FALSE, TRUE),
      ('EV009', 'digital', 'LOC002', 'Thomas''s phone cell tower data', NULL, FALSE, NULL, TRUE, FALSE),
      ('EV010', 'testimonial', 'LOC003', 'Girlfriend claims Thomas was home all evening', NULL, TRUE, 'Alibi provider', FALSE, TRUE),
      ('EV011', 'physical', 'LOC005', 'Bar surveillance shows Rachel left at 6:30pm not 8pm', NULL, TRUE, 'Breaks Rachel''s timeline', FALSE, TRUE),
      ('EV012', 'testimonial', 'LOC001', 'Jason Pierce seen running from park at 7:20pm', NULL, TRUE, 'Red herring', FALSE, TRUE);
  `);

    await execute(`
      INSERT INTO game_state VALUES
        (1, 'P001', '2024-03-16 08:00:00', 1, 50000, 50, FALSE, NULL);
    `);

    isLoaded = true;
    console.log('Case loaded successfully');
  } finally {
    isLoading = false;
  }
}

export const INTERVIEW_RESPONSES: Record<string, Record<string, { answer: string; body_language?: string; stress_increase: number }>> = {
  P002: {
    'Where were you on March 15th between 6pm and 8pm?': {
      answer: 'I was at home with my girlfriend Rachel. We were watching TV, just relaxing.',
      body_language: 'shifts weight, avoids eye contact',
      stress_increase: 2
    },
    'Can anyone verify that?': {
      answer: 'Yeah, Rachel was there the whole time. She can tell you.',
      body_language: 'defensive posture',
      stress_increase: 1
    },
    'What was your relationship with Margaret Chen?': {
      answer: 'She\'s my ex-wife. We... we had our issues. The divorce was rough.',
      body_language: 'clenches jaw',
      stress_increase: 3
    },
    'Tell me about the custody battle.': {
      answer: 'Look, I love my daughter. Margaret was trying to keep her from me. It wasn\'t fair.',
      body_language: 'raises voice slightly, agitated',
      stress_increase: 4
    },
    'Did you purchase new hiking boots recently?': {
      answer: 'What? Uh... yeah, I needed new work boots. What does that have to do with anything?',
      body_language: 'surprised, then defensive',
      stress_increase: 5
    },
    'A neighbor saw you leave your house at 6:30pm. Care to explain?': {
      answer: 'I... I went to get cigarettes. Just for a few minutes. Then came right back.',
      body_language: 'sweating, nervous',
      stress_increase: 6
    },
    'Where did you go to get cigarettes?': {
      answer: 'The gas station on Highway 9. It\'s like 10 minutes away.',
      body_language: 'fidgeting',
      stress_increase: 3
    },
    'Security cameras show your truck near Riverside Park at 6:55pm.': {
      answer: 'I... okay, fine. I drove past the park. I knew Margaret jogged there. I just wanted to talk to her about Sarah.',
      body_language: 'looks down, defeated',
      stress_increase: 8
    },
    'What happened when you saw her?': {
      answer: 'We argued. About money, about Sarah. She wouldn\'t listen. But I didn\'t... I didn\'t kill her!',
      body_language: 'tears forming, shaking',
      stress_increase: 9
    }
  },
  P007: {
    'Where was Thomas on the evening of March 15th?': {
      answer: 'He was home with me. We were watching a movie together.',
      body_language: 'speaks quickly, rehearsed',
      stress_increase: 3
    },
    'What time did you get home from work?': {
      answer: 'Around 8pm. I work at Miller\'s Bar.',
      body_language: 'maintains eye contact',
      stress_increase: 1
    },
    'Your boss says you left at 6:30pm, not 8pm.': {
      answer: 'Oh... right, yeah. I left early that night. I forgot.',
      body_language: 'caught off guard, nervous',
      stress_increase: 6
    },
    'Why did you lie about when you got home?': {
      answer: 'I didn\'t mean to lie. I just... Thomas asked me to say I was there all night. He said it would look bad.',
      body_language: 'crying, conflicted',
      stress_increase: 8
    },
    'Did Thomas tell you where he went that evening?': {
      answer: 'He said he went to talk to Margaret. To try to work things out. He came back really upset.',
      body_language: 'worried, protective',
      stress_increase: 5
    }
  },
  P004: {
    'Why were you running from the park that night?': {
      answer: 'Man, I just... I was there, and I heard something. Got spooked. I didn\'t do anything!',
      body_language: 'extremely nervous, shaking',
      stress_increase: 7
    },
    'What did you hear?': {
      answer: 'Like... raised voices. A woman yelling. Then it went quiet. I got scared and ran.',
      body_language: 'paranoid, looking around',
      stress_increase: 5
    },
    'Did you see anyone else in the park?': {
      answer: 'I saw... I think I saw a truck. Dark colored. Parked near the entrance.',
      body_language: 'trying to remember',
      stress_increase: 3
    },
    'Why were you in the park?': {
      answer: 'I was just... walking. Trying to clear my head.',
      body_language: 'evasive',
      stress_increase: 4
    }
  },
  P005: {
    'You were jogging in the park that evening?': {
      answer: 'Yes, I go jogging there most evenings. Margaret and I would sometimes jog together.',
      body_language: 'calm, sad',
      stress_increase: 1
    },
    'Did you see Margaret that night?': {
      answer: 'I saw her on the trail around 7pm. We waved at each other. She seemed fine.',
      body_language: 'helpful',
      stress_increase: 2
    },
    'Did you hear or see anything unusual?': {
      answer: 'Around 7:20, I heard what sounded like a scream. I started running toward it, but then I saw that man Jason running away.',
      body_language: 'concerned, worried',
      stress_increase: 3
    }
  },
  P011: {
    'You live near the Webbs. Did you see Thomas on March 15th?': {
      answer: 'Oh yes, dear. I saw him leave around 6:30. He was in a hurry.',
      body_language: 'eager to share',
      stress_increase: 0
    },
    'Did you see him return?': {
      answer: 'He came back around 7:45 or so. Looked agitated. Rachel let him in.',
      body_language: 'matter-of-fact',
      stress_increase: 1
    },
    'How well did you know Margaret Chen?': {
      answer: 'Sweet woman. Always said hello. It\'s such a tragedy.',
      body_language: 'sympathetic',
      stress_increase: 1
    }
  },
  P006: {
    'Tell me about Margaret\'s state of mind recently.': {
      answer: 'She was stressed. The custody battle with Thomas was wearing on her. She was worried about Sarah.',
      body_language: 'grieving, tired',
      stress_increase: 2
    },
    'Did she mention any threats from Thomas?': {
      answer: 'Not explicit threats, but he would get angry. Send nasty texts. She was afraid of what he might do.',
      body_language: 'angry, protective',
      stress_increase: 4
    },
    'What time did she leave for her jog?': {
      answer: 'Around 6:45pm. She always jogged the same route at the same time.',
      body_language: 'factual, sad',
      stress_increase: 1
    }
  },
  P003: {
    'How are your parents getting along?': {
      answer: 'They fight a lot. About money. About me. Dad gets really angry sometimes.',
      body_language: 'quiet, scared',
      stress_increase: 3
    },
    'Was your dad home the night your mom died?': {
      answer: 'He left for a while. Said he was getting cigarettes. Rachel was there.',
      body_language: 'hesitant, protective of father',
      stress_increase: 5
    },
    'Did your dad ever talk about your mom?': {
      answer: 'He said she was trying to take me away from him. That she was being unfair.',
      body_language: 'conflicted, tearful',
      stress_increase: 6
    }
  },
  P009: {
    'You teach Sarah Webb?': {
      answer: 'Yes, she\'s in my class. Sweet girl but seems troubled lately.',
      body_language: 'professional, concerned',
      stress_increase: 1
    },
    'Did she write anything concerning in her schoolwork?': {
      answer: 'She wrote an essay about her parents fighting about money. It was... troubling. I considered reporting it.',
      body_language: 'worried, ethical conflict',
      stress_increase: 3
    }
  }
};
