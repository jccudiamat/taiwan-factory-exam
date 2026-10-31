import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lib/lessons';
import {lessonVideos,lessonVideoSections,sectionVideos} from '../src/lib/lesson-videos';

test('every teaching section has attributed video resources with valid original watch IDs and specific study prompts',()=>{
  const sections=lessons.flatMap(lesson=>lesson.sections);
  assert.deepEqual(Object.keys(lessonVideoSections).sort(),sections.map(section=>section.id).sort());
  const ids=Object.values(lessonVideos).map(video=>video.id);
  assert.equal(new Set(ids).size,ids.length);
  for(const section of sections){
    const resources=sectionVideos(section.id);
    assert.ok(resources.length>=1&&resources.length<=2,section.id);
    assert.equal(new Set(resources.map(item=>item.video.id)).size,resources.length);
    for(const {video,focus} of resources){
      assert.match(video.id,/^[\w-]{11}$/);
      assert.ok(video.title.length>5&&video.channel.length>2);
      assert.ok(focus.length>=60,section.id);
    }
  }
  assert.deepEqual(sectionVideos('final-assessment'),[]);
  assert.deepEqual(sectionVideos('unknown-section'),[]);
});
