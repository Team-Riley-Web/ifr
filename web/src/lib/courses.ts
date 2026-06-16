import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const CONTENT_BASE = process.env.CONTENT_BASE_PATH ?? path.resolve(__dirname, '../../../');

export interface MediaFile {
  label: string;
  file: string; // relative to course folder
  type: 'video' | 'audio';
}

export interface Tab {
  id: string;
  label: string;
  files: MediaFile[];
}

export interface Lesson {
  id: string;
  title: string;
  tabs: Tab[];
}

export interface Course {
  id: string;
  title: string;
  folder: string; // relative to CONTENT_BASE
  lessons: Lesson[];
}

function video(file: string, label = 'Video'): MediaFile {
  return { label, file, type: 'video' };
}
function audio(file: string, label = 'Audio'): MediaFile {
  return { label, file, type: 'audio' };
}

export const courses: Course[] = [
  {
    id: 'core-skills',
    title: 'Core Skills',
    folder: '01. Core Skills',
    lessons: [
      {
        id: 'half-steps',
        title: 'Half Steps',
        tabs: [
          { id: 'main',   label: 'Main',   files: [video('01. Half Steps.mp4')] },
          { id: 'guitar', label: 'Guitar', files: [video('Guitar/01. Half Steps - Cloud exercise.mp4', 'Cloud Exercise'), video('Guitar/02 Half Steps - Mobility exercise.mp4', 'Mobility Exercise')] },
          { id: 'piano',  label: 'Piano',  files: [video('Piano/01. Half Steps.mp4')] },
        ],
      },
      {
        id: 'whole-steps',
        title: 'Whole Steps',
        tabs: [
          { id: 'main',   label: 'Main',   files: [video('02. Whole steps.mp4')] },
          { id: 'guitar', label: 'Guitar', files: [video('Guitar/03. Whole steps.mp4')] },
          { id: 'piano',  label: 'Piano',  files: [video('Piano/02. Whole Steps.mp4')] },
        ],
      },
      {
        id: 'ifr-tonal-map',
        title: 'The IFR Tonal Map',
        tabs: [
          { id: 'main',   label: 'Main',   files: [video('03. The IFR Tonal Map.mp4')] },
          { id: 'guitar', label: 'Guitar', files: [video('Guitar/04. The IFR Tonal Map.mp4')] },
          { id: 'piano',  label: 'Piano',  files: [video('Piano/03. The IFR Tonal Map.mp4')] },
        ],
      },
    ],
  },
  {
    id: 'seven-worlds',
    title: 'Seven Worlds',
    folder: '02. Seven Worlds',
    lessons: [
      {
        id: 'first-harmonic-environment',
        title: 'The First Harmonic Environment',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('01. The First Harmonic Environment/01. The First Harmonic Environment.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('01. The First Harmonic Environment/02. Guitar.mp4')] },
          { id: 'piano',        label: 'Piano',        files: [video('01. The First Harmonic Environment/02. Piano.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('01. The First Harmonic Environment/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('01. The First Harmonic Environment/04. First Harmonic Environment — meditative.mp3', 'Meditative'), audio('01. The First Harmonic Environment/05. First Harmonic Environment — advanced.mp3', 'Advanced')] },
        ],
      },
      {
        id: 'the-1-chord',
        title: 'The 1 Chord',
        tabs: [
          { id: 'main',   label: 'Main',   files: [video('02. The 1 chord/01. The 1 chord.mp4')] },
          { id: 'guitar', label: 'Guitar', files: [video('02. The 1 chord/02. Guitar.mp4')] },
          { id: 'piano',  label: 'Piano',  files: [video('02. The 1 chord/02. Piano.mp4')] },
          { id: 'audio',  label: 'Audio',  files: [audio('02. The 1 chord/03. STN 1 chord 1357.mp3', 'Sing the Numbers')] },
        ],
      },
      {
        id: 'second-harmonic-environment',
        title: 'The Second Harmonic Environment',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('03. The Second Harmonic Environment/01. The Second Harmonic Environment.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('03. The Second Harmonic Environment/02. Guitar.mp4')] },
          { id: 'piano',        label: 'Piano',        files: [video('03. The Second Harmonic Environment/02. Piano.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('03. The Second Harmonic Environment/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('03. The Second Harmonic Environment/04. Second Harmonic Environment — meditative.mp3', 'Meditative'), audio('03. The Second Harmonic Environment/05. Second Harmonic Environment — advanced.mp3', 'Advanced')] },
        ],
      },
      {
        id: 'the-2-chord',
        title: 'The 2- Chord',
        tabs: [
          { id: 'main',   label: 'Main',   files: [video('04. The 2- chord/01. The 2- chord.mp4')] },
          { id: 'guitar', label: 'Guitar', files: [video('04. The 2- chord/02. Guitar.mp4')] },
          { id: 'piano',  label: 'Piano',  files: [video('04. The 2- chord/02. Piano.mp4')] },
          { id: 'audio',  label: 'Audio',  files: [audio('04. The 2- chord/03. The notes of the 2- chord 2 4 6 1 ifr_sing_the_numbers_3_track_05.mp3', 'Sing the Numbers')] },
        ],
      },
      {
        id: 'third-harmonic-environment',
        title: 'The Third Harmonic Environment',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('05. The Third Harmonic Environment/01. The Third Harmonic Environment.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('05. The Third Harmonic Environment/02. Guitar.mp4')] },
          { id: 'piano',        label: 'Piano',        files: [video('05. The Third Harmonic Environment/02. Piano.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('05. The Third Harmonic Environment/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('05. The Third Harmonic Environment/04. Third Harmonic Environment — meditative.mp3', 'Meditative'), audio('05. The Third Harmonic Environment/05. Third Harmonic Environment — advanced ifr_sing_the_numbers_3_track_09.mp3', 'Advanced')] },
        ],
      },
      {
        id: 'the-3-chord',
        title: 'The 3- Chord',
        tabs: [
          { id: 'main',   label: 'Main',   files: [video('06. The 3- chord/01. The 3- chord.mp4')] },
          { id: 'guitar', label: 'Guitar', files: [video('06. The 3- chord/02. Guitar.mp4')] },
          { id: 'piano',  label: 'Piano',  files: [video('06. The 3- chord/02. Piano.mp4')] },
          { id: 'audio',  label: 'Audio',  files: [audio('06. The 3- chord/03. Ear Training 3- chord 3 5 7 2 ifr_sing_the_numbers_3_track_08.mp3', 'Ear Training Audio')] },
        ],
      },
      {
        id: 'fourth-harmonic-environment',
        title: 'The Fourth Harmonic Environment',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('07. The Fourth Harmonic Environment/01. The Fourth Harmonic Environment.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('07. The Fourth Harmonic Environment/02. Guitar.mp4')] },
          { id: 'piano',        label: 'Piano',        files: [video('07. The Fourth Harmonic Environment/02. Piano.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('07. The Fourth Harmonic Environment/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('07. The Fourth Harmonic Environment/04. Fourth Harmonic Environment — meditative.mp3', 'Meditative'), audio('07. The Fourth Harmonic Environment/05. Fourth Harmonic Environment — advanced.mp3', 'Advanced')] },
        ],
      },
      {
        id: 'the-4-chord',
        title: 'The 4 Chord',
        tabs: [
          { id: 'main',   label: 'Main',   files: [video('08. The 4 chord/01. The 4 chord.mp4')] },
          { id: 'guitar', label: 'Guitar', files: [video('08. The 4 chord/02. Guitar.mp4')] },
          { id: 'piano',  label: 'Piano',  files: [video('08. The 4 chord/02. Piano.mp4')] },
          { id: 'audio',  label: 'Audio',  files: [audio('08. The 4 chord/03. 4 chord 4 6 1 3 ifr_sing_the_numbers_3_track_11.mp3', 'Sing the Numbers')] },
        ],
      },
      {
        id: 'fifth-harmonic-environment',
        title: 'The Fifth Harmonic Environment',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('09. The Fifth Harmonic Environment/0.1 The Fifth Harmonic Environment.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('09. The Fifth Harmonic Environment/02. Guitar.mp4')] },
          { id: 'piano',        label: 'Piano',        files: [video('09. The Fifth Harmonic Environment/02. Piano.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('09. The Fifth Harmonic Environment/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('09. The Fifth Harmonic Environment/04. Fifth Harmonic Environment — meditativeifr_sing_the_numbers_3_track_13.mp3', 'Meditative'), audio('09. The Fifth Harmonic Environment/05. Fifth Harmonic Environment — advancedifr_sing_the_numbers_3_track_15.mp3', 'Advanced')] },
        ],
      },
      {
        id: 'the-5d-chord',
        title: 'The 5D Chord',
        tabs: [
          { id: 'main',   label: 'Main',   files: [video('10. The 5D chord/01. The 5D chord.mp4')] },
          { id: 'guitar', label: 'Guitar', files: [video('10. The 5D chord/02. Guitar.mp4')] },
          { id: 'piano',  label: 'Piano',  files: [video('10. The 5D chord/02. Piano.mp4')] },
          { id: 'audio',  label: 'Audio',  files: [audio('10. The 5D chord/03. 5D chord 5 7 2 4 ifr_sing_the_numbers_3_track_14.mp3', 'Sing the Numbers')] },
        ],
      },
      {
        id: 'sixth-harmonic-environment',
        title: 'The Sixth Harmonic Environment',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('11. The Sixth Harmonic Environment/01. The Sixth Harmonic Environment.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('11. The Sixth Harmonic Environment/02. Guitar.mp4')] },
          { id: 'piano',        label: 'Piano',        files: [video('11. The Sixth Harmonic Environment/02. Piano.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('11. The Sixth Harmonic Environment/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('11. The Sixth Harmonic Environment/04. Sixth Harmonic Environment — meditative ifr_sing_the_numbers_3_track_16.mp3', 'Meditative'), audio('11. The Sixth Harmonic Environment/05. Sixth Harmonic Environment — advanced ifr_sing_the_numbers_3_track_18.mp3', 'Advanced')] },
        ],
      },
      {
        id: 'the-6-chord',
        title: 'The 6- Chord',
        tabs: [
          { id: 'main',   label: 'Main',   files: [video('12. The 6- chord/01. The 6- chord.mp4')] },
          { id: 'guitar', label: 'Guitar', files: [video('12. The 6- chord/02. Guitar.mp4')] },
          { id: 'piano',  label: 'Piano',  files: [video('12. The 6- chord/02. Piano.mp4')] },
          { id: 'audio',  label: 'Audio',  files: [audio('12. The 6- chord/03. 6- chord 6 1 3 5 ifr_sing_the_numbers_3_track_17.mp3', 'Sing the Numbers')] },
        ],
      },
      {
        id: 'seventh-harmonic-environment',
        title: 'The Seventh Harmonic Environment',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('13. The Seventh Harmonic Environment/01. The Seventh Harmonic Environment.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('13. The Seventh Harmonic Environment/02. Guitar.mp4')] },
          { id: 'piano',        label: 'Piano',        files: [video('13. The Seventh Harmonic Environment/02. Piano.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('13. The Seventh Harmonic Environment/03. Ear Training.mp4')] },
        ],
      },
      {
        id: 'the-7b5-chord',
        title: 'The 7-b5 Chord',
        tabs: [
          { id: 'main',   label: 'Main',   files: [video('14. The 7-b5 chord/01. The 7-b5 chord.mp4')] },
          { id: 'guitar', label: 'Guitar', files: [video('14. The 7-b5 chord/02. Guitar.mp4')] },
          { id: 'piano',  label: 'Piano',  files: [video('14. The 7-b5 chord/02. Piano.mp4')] },
          { id: 'audio',  label: 'Audio',  files: [audio('14. The 7-b5 chord/03. 7-b5 chord ifr_sing_the_numbers_3_track_20.mp3', 'Sing the Numbers')] },
        ],
      },
    ],
  },
  {
    id: 'pure-harmony-essentials',
    title: 'Pure Harmony Essentials',
    folder: '03. Pure Harmony Essentials',
    lessons: [
      {
        id: 'chords-1-and-4',
        title: 'Chords 1 and 4',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('01. Chords 1 and 4/01 Chords 1 and 4.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('01. Chords 1 and 4/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('01. Chords 1 and 4/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('01. Chords 1 and 4/IFR_Pure_Harmony_Essentials_MIreia_singalong_lesson_01_chords_1_and_4.mp3', 'Singalong')] },
        ],
      },
      {
        id: 'chords-1-and-5d',
        title: 'Chords 1 and 5D',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('02. Chords 1 and 5D/01. Chords 1 and 5D.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('02. Chords 1 and 5D/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('02. Chords 1 and 5D/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('02. Chords 1 and 5D/IFR_Pure_Harmony_Essentials_MIreia_singalong_lesson_02_chords_1_and_5D.mp3', 'Singalong')] },
        ],
      },
      {
        id: 'chords-1-5d-5d-1',
        title: 'Chords 1, 5D, 5D, 1',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('03. Chords 1, 5D, 5D, 1/01. Chords 1, 5D, 5D, 1.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('03. Chords 1, 5D, 5D, 1/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('03. Chords 1, 5D, 5D, 1/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('03. Chords 1, 5D, 5D, 1/IFR_Pure_Harmony_Essentials_MIreia_singalong_lesson_03_chords_1_5D_5D_1.mp3', 'Singalong')] },
        ],
      },
      {
        id: 'chords-1-4-1-5d',
        title: 'Chords 1, 4, 1, 5D',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('04. Chords 1, 4, 1, 5D/01. Chords 1, 4, 1, 5D.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('04. Chords 1, 4, 1, 5D/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('04. Chords 1, 4, 1, 5D/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('04. Chords 1, 4, 1, 5D/IFR_Pure_Harmony_Essentials_MIreia_singalong_lesson_04_chords_1_4_1_5D.mp3', 'Singalong')] },
        ],
      },
      {
        id: 'chords-4-5d-1-1',
        title: 'Chords 4, 5D, 1, 1',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('05. Chords 4, 5D, 1, 1/01. Chords 4, 5D, 1, 1.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('05. Chords 4, 5D, 1, 1/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('05. Chords 4, 5D, 1, 1/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('05. Chords 4, 5D, 1, 1/IFR_Pure_Harmony_Essentials_MIreia_singalong_lesson_05_chords_4_5D_1_1.mp3', 'Singalong')] },
        ],
      },
      {
        id: 'chords-1-and-4-as-major-7th',
        title: 'Chords 1 and 4 as Major 7th Chords',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('06. Chords 1 and 4 as major 7th chords/01. Chords 1 and 4 as major 7th chords.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('06. Chords 1 and 4 as major 7th chords/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('06. Chords 1 and 4 as major 7th chords/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('06. Chords 1 and 4 as major 7th chords/IFR_Pure_Harmony_Essentials_MIreia_singalong_lesson_06_chords_1_and_4_as_seventh_chords.mp3', 'Singalong'), audio('06. Chords 1 and 4 as major 7th chords/IFR_Pure_Harmony_Essentials_Mireia_singalong_lesson_06_roots_singalong.mp3', 'Roots Singalong')] },
        ],
      },
      {
        id: 'chords-1-and-6',
        title: 'Chords 1 and 6-',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('07. Chords 1 and 6-/01. Chords 1 and 6-.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('07. Chords 1 and 6-/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('07. Chords 1 and 6-/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('07. Chords 1 and 6-/IFR_Pure_Harmony_Essentials_Mireia_singalong_lesson_07_chords_1_and_6-.mp3', 'Singalong')] },
        ],
      },
      {
        id: 'chords-1-6-4-5d',
        title: 'Chords 1, 6-, 4, 5D',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('08. Chords 1, 6-, 4, 5D/01. Chords 1, 6-, 4, 5D.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('08. Chords 1, 6-, 4, 5D/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('08. Chords 1, 6-, 4, 5D/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('08. Chords 1, 6-, 4, 5D/IFR_Pure_Harmony_Essentials_Mireia_singalong_lesson_08_chords_1_6-_4_5D.mp3', 'Singalong')] },
        ],
      },
      {
        id: 'chords-6-and-5d',
        title: 'Chords 6- and 5D',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('09. Chords 6- and 5D/01. Chords 6- and 5D.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('09. Chords 6- and 5D/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('09. Chords 6- and 5D/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('09. Chords 6- and 5D/IFR_Pure_Harmony_Essentials_Mireia_singalong_lesson_09_chords_6-_and_5D.mp3', 'Singalong')] },
        ],
      },
      {
        id: 'chords-6-and-4',
        title: 'Chords 6- and 4',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('10. Chords 6- and 4/01. Chords 6- and 4.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('10. Chords 6- and 4/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('10. Chords 6- and 4/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('10. Chords 6- and 4/IFR_Pure_Harmony_Essentials_Mireia_singalong_lesson_10_chords_6-_and_4.mp3', 'Singalong')] },
        ],
      },
      {
        id: 'chords-6-4-1-5d',
        title: 'Chords 6-, 4, 1, 5D',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('11. Chords 6-, 4, 1, 5D/01. Chords 6-, 4, 1, 5D.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('11. Chords 6-, 4, 1, 5D/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('11. Chords 6-, 4, 1, 5D/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('11. Chords 6-, 4, 1, 5D/IFR_Pure_Harmony_Essentials_Mireia_singalong_lesson_11_chords_6-_4_1_5D.mp3', 'Singalong')] },
        ],
      },
      {
        id: 'chords-1-5d-6-4',
        title: 'Chords 1, 5D, 6-, 4',
        tabs: [
          { id: 'main',         label: 'Main',         files: [video('12. Chords 1, 5D, 6-, 4/01. Chords 1, 5D, 6-, 4.mp4')] },
          { id: 'guitar',       label: 'Guitar',       files: [video('12. Chords 1, 5D, 6-, 4/02. Guitar.mp4')] },
          { id: 'ear-training', label: 'Ear Training', files: [video('12. Chords 1, 5D, 6-, 4/03. Ear Training.mp4')] },
          { id: 'audio',        label: 'Audio',        files: [audio('12. Chords 1, 5D, 6-, 4/IFR_Pure_Harmony_Essentials_Mireia_singalong_lesson_12_chords_1_5D_6-_4.mp3', 'Singalong')] },
        ],
      },
    ],
  },
  {
    id: 'chord-melody',
    title: 'Chord Melody',
    folder: '04. Chord Melody',
    lessons: [
      { id: 'chord-notes-bass-note',          title: 'Chord Notes + Bass Note',               tabs: [{ id: 'main', label: 'Main', files: [video('01. Chord notes + bass note.mp4')] }] },
      { id: 'chords-1-and-4-combined',        title: 'Chords 1 and 4 Combined',               tabs: [{ id: 'main', label: 'Main', files: [video('02. Chords 1 and 4 combined.mp4')] }] },
      { id: 'adding-the-5d-chord',            title: 'Adding the 5D Chord',                   tabs: [{ id: 'main', label: 'Main', files: [video('03. Adding the 5D chord.mp4')] }] },
      { id: 'building-choir-1-chord',         title: 'Building the Choir in the 1 Chord',     tabs: [{ id: 'main', label: 'Main', files: [video('04. Building the choir in the 1 chord.mp4')] }] },
      { id: 'building-choir-4-chord',         title: 'Building the Choir in the 4 Chord',     tabs: [{ id: 'main', label: 'Main', files: [video('05. Building the choir in the 4 chord.mp4')] }] },
      { id: 'building-choir-5d-chord',        title: 'Building the Choir in the 5D Chord',    tabs: [{ id: 'main', label: 'Main', files: [video('06. Building the choir in the 5D chord.mp4')] }] },
      { id: 'accompaniment-techniques-1',     title: 'Accompaniment Techniques, Part 1',       tabs: [{ id: 'main', label: 'Main', files: [video('07. Accompaniment techniques, part 1.mp4')] }] },
      { id: 'accompaniment-techniques-2',     title: 'Accompaniment Techniques, Part 2',       tabs: [{ id: 'main', label: 'Main', files: [video('08. Accompaniment techniques, part 2.mp4')] }] },
      { id: 'adding-singer-1-chord',          title: 'Adding the Singer to the 1 Chord',       tabs: [{ id: 'main', label: 'Main', files: [video('09. Adding the singer to the 1 chord.mp4')] }] },
      { id: 'adding-singer-4-chord',          title: 'Adding the Singer to the 4 Chord',       tabs: [{ id: 'main', label: 'Main', files: [video('10. Adding the singer to the 4 chord.mp4')] }] },
      { id: 'adding-singer-5d-chord',         title: 'Adding the Singer to the 5D Chord',      tabs: [{ id: 'main', label: 'Main', files: [video('11. Adding the singer to the 5D chord.mp4')] }] },
      { id: 'integrating-chords-1-4-5d',      title: 'Integrating Chords 1, 4 and 5D',         tabs: [{ id: 'main', label: 'Main', files: [video('12. Integrating chords 1, 4 and 5D.mp4')] }] },
      { id: 'creative-exploration-1-4-5d',    title: 'Creative Exploration of Chords 1, 4 and 5D', tabs: [{ id: 'main', label: 'Main', files: [video('13. Creative exploration of chords 1, 4 and 5D.mp4')] }] },
      { id: 'introducing-6-chord',            title: 'Introducing the 6- Chord',               tabs: [{ id: 'main', label: 'Main', files: [video('14. Introducing the 6- chord.mp4')] }] },
      { id: 'building-choir-6-chord',         title: 'Building the Choir in the 6- Chord',     tabs: [{ id: 'main', label: 'Main', files: [video('15. Building the choir in the 6- chord.mp4')] }] },
      { id: 'adding-singer-6-chord',          title: 'Adding the Singer to the 6- Chord',       tabs: [{ id: 'main', label: 'Main', files: [video('16. Adding the singer to the 6- chord.mp4')] }] },
      { id: 'integrating-all-four-chords',    title: 'Integrating All Four Chords',             tabs: [{ id: 'main', label: 'Main', files: [video('17. Integrating all four chords.mp4')] }] },
      { id: 'performance-tips-and-strategies', title: 'Performance Tips and Strategies',        tabs: [{ id: 'main', label: 'Main', files: [video('18. Performance tips and strategies.mp4')] }] },
    ],
  },
  {
    id: 'chord-melody-2',
    title: 'Chord Melody 2',
    folder: '05. Chord Melody 2',
    lessons: [
      { id: 'building-new-tonal-map',          title: 'Building the New Tonal Map',                     tabs: [{ id: 'main', label: 'Main', files: [video('01. Building the new tonal map.mp4')] }] },
      { id: 'adding-the-2-chord',              title: 'Adding the 2- Chord',                            tabs: [{ id: 'main', label: 'Main', files: [video('02. Adding the 2- chord.mp4')] }] },
      { id: 'tension-5d-1st-octave',           title: 'Creating Tension in the 5D Chord (1st Octave)',  tabs: [{ id: 'main', label: 'Main', files: [video('03. Creating tension in the 5D chord (1st octave).mp4')] }] },
      { id: 'tension-5d-2nd-octave',           title: 'Creating Tension in the 5D Chord (2nd Octave)',  tabs: [{ id: 'main', label: 'Main', files: [video('04. Creating tension in the 5D chord (2nd octave).mp4')] }] },
      { id: '2-5-1-technical-review',          title: 'The 2-5-1 Chord Progression (Technical Review)', tabs: [{ id: 'main', label: 'Main', files: [video('05. The 2-5-1 chord progression (technical review).mp4')] }] },
      { id: '2-5-1-creative-practice',         title: 'The 2-5-1 Progression (Creative Practice)',      tabs: [{ id: 'main', label: 'Main', files: [video('06. The 2-5-1 progression (creative practice).mp4')] }] },
      { id: 'three-palettes-of-colors',        title: 'Using Our Three Palettes of Colors',              tabs: [{ id: 'main', label: 'Main', files: [video('07. Using our three palettes of colors.mp4')] }] },
      { id: 'dynamics-and-interpretation',     title: 'Dynamics and Interpretation',                     tabs: [{ id: 'main', label: 'Main', files: [video('08. Dynamics and interpretation.mp4')] }] },
      { id: 'melodic-use-of-outside-notes',    title: 'Melodic Use of Outside Notes',                    tabs: [{ id: 'main', label: 'Main', files: [video('09. Melodic use of outside notes.mp4')] }] },
      { id: 'adding-6-chord',                  title: 'Adding the 6- Chord',                             tabs: [{ id: 'main', label: 'Main', files: [video('10. Adding the 6- chord.mp4')] }] },
      { id: '3d-harmonic-environment',         title: 'The 3D Harmonic Environment',                     tabs: [{ id: 'main', label: 'Main', files: [video('11. The 3D harmonic environment.mp4')] }] },
      { id: '3d-chord-bass-choir-singer',      title: 'The 3D Chord Bass, Choir and Singer',             tabs: [{ id: 'main', label: 'Main', files: [video('12. The 3D chord bass choir and singer.mp4')] }] },
      { id: 'relationship-3d-and-6',          title: 'The Relationship Between 3D and 6-',              tabs: [{ id: 'main', label: 'Main', files: [video('13. The relationship between 3D and 6-.mp4')] }] },
      { id: 'introducing-7b5-chord',           title: 'Introducing the 7-b5 Chord',                      tabs: [{ id: 'main', label: 'Main', files: [video('14. Introducing the 7-b5 chord.mp4')] }] },
      { id: '7-3-6-progression-melody-paths',  title: 'The 7-3-6 Progression (Melody Paths)',            tabs: [{ id: 'main', label: 'Main', files: [video('15. The 7-3-6 progression (Melody Paths).mp4')] }] },
      { id: '7-3-6-progression-other-colors',  title: 'The 7-3-6 Progression (Other Colors)',            tabs: [{ id: 'main', label: 'Main', files: [video('16. The 7-3-6 progression (other colors).mp4')] }] },
      { id: 'adding-the-4-chord',              title: 'Adding the 4 Chord',                              tabs: [{ id: 'main', label: 'Main', files: [video('17. Adding the 4 chord.mp4')] }] },
      { id: 'complete-autumn-leaves',          title: "The Complete 'Autumn Leaves' Progression",         tabs: [{ id: 'main', label: 'Main', files: [video('18. The complete ‘Autumn Leaves’ progression.mp4')] }] },
    ],
  },
  {
    id: 'violin-looping',
    title: 'Violin Looping',
    folder: '06. Violin Looping',
    lessons: [
      { id: 'technical-setup',          title: 'Technical Setup',          tabs: [{ id: 'main', label: 'Main', files: [video('00. Technical Setup.mp4')] }] },
      { id: 'the-bass-drone',           title: 'The Bass Drone',           tabs: [{ id: 'main', label: 'Main', files: [video('01. The Bass Drone.mp4')] }] },
      { id: 'tonal-centers',            title: 'Tonal Centers',            tabs: [{ id: 'main', label: 'Main', files: [video('02. Tonal Centers.mp4')] }] },
      { id: 'sound-effects',            title: 'Sound Effects',            tabs: [{ id: 'main', label: 'Main', files: [video('03. Sound Effects.mp4')] }] },
      { id: 'movement-in-the-bass',     title: 'Movement in the Bass',     tabs: [{ id: 'main', label: 'Main', files: [video('04. Movement in the Bass.mp4')] }] },
      { id: 'pizzicato-accompaniment',  title: 'Pizzicato Accompaniment',  tabs: [{ id: 'main', label: 'Main', files: [video('05. Pizzicato Accompaniment.mp4')] }] },
      { id: 'percussion',               title: 'Percussion',               tabs: [{ id: 'main', label: 'Main', files: [video('06. Percussion.mp4')] }] },
      { id: 'bowed-accompaniment',      title: 'Bowed Accompaniment',      tabs: [{ id: 'main', label: 'Main', files: [video('07. Bowed Accompaniment.mp4')] }] },
      { id: 'chopping',                 title: 'Chopping',                 tabs: [{ id: 'main', label: 'Main', files: [video('08. Chopping.mp4')] }] },
      { id: 'mastering-the-model',      title: 'Mastering the Model',      tabs: [{ id: 'main', label: 'Main', files: [video('09. Mastering the Model.mp4')] }] },
      { id: 'chord-progressions-1',     title: 'Chord Progressions 1',     tabs: [{ id: 'main', label: 'Main', files: [video('10. Chord Progressions 1.mp4')] }] },
      { id: 'chord-progressions-2',     title: 'Chord Progressions 2',     tabs: [{ id: 'main', label: 'Main', files: [video('11. Chord Progressions 2.mp4')] }] },
      { id: 'creating-a-strong-ending', title: 'Creating a Strong Ending', tabs: [{ id: 'main', label: 'Main', files: [video('12. Creating a Strong Ending.mp4')] }] },
      { id: 'soloing-over-loops',       title: 'Soloing Over Your Loops',  tabs: [{ id: 'main', label: 'Main', files: [video('13. Soloing Over Your Loops.mp4')] }] },
      { id: 'breaking-the-mold',        title: 'Breaking the Mold',        tabs: [{ id: 'main', label: 'Main', files: [video('14. Breaking the Mold.mp4')] }] },
      { id: 'performing-your-music',    title: 'Performing Your Music',    tabs: [{ id: 'main', label: 'Main', files: [video('15. Performing Your Music.mp4')] }] },
    ],
  },
];

export function getCourse(courseId: string): Course | undefined {
  return courses.find(c => c.id === courseId);
}

export function getLesson(courseId: string, lessonId: string) {
  const course = getCourse(courseId);
  return course?.lessons.find(l => l.id === lessonId);
}

export function getMediaFilePath(courseId: string, lessonId: string, tabId: string, fileIndex: number): string | null {
  const key = getMediaObjectKey(courseId, lessonId, tabId, fileIndex);
  return key ? path.join(CONTENT_BASE, key) : null;
}

export function getMediaObjectKey(courseId: string, lessonId: string, tabId: string, fileIndex: number): string | null {
  const course = getCourse(courseId);
  if (!course) return null;
  const lesson = course.lessons.find(l => l.id === lessonId);
  if (!lesson) return null;
  const tab = lesson.tabs.find(t => t.id === tabId);
  if (!tab) return null;
  const file = tab.files[fileIndex];
  if (!file) return null;
  return path.posix.join(course.folder, file.file);
}

export function getPdfPath(courseId: string): string | null {
  const key = getPdfObjectKey(courseId);
  return key ? path.join(CONTENT_BASE, key) : null;
}

export function getPdfObjectKey(courseId: string): string | null {
  const course = getCourse(courseId);
  if (!course) return null;
  return path.posix.join(course.folder, 'IFR.pdf');
}
