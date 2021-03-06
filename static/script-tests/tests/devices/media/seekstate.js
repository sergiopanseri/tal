/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

(function() {
    this.SeekStateTest = AsyncTestCase("Devices.Media.SeekState");

    this.SeekStateTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.SeekStateTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.SeekStateTest.prototype.testSeekToGeneratesSeeking = function (queue) {
        queuedRequire(queue, ["antie/devices/media/seekstate"], function( SeekState ) {
            var bubbleEventStub = sinon.stub();

            var mediaWidget = {};

            queue.call("SeekTo", function (callbacks) {
                mediaWidget.bubbleEvent = callbacks.add( bubbleEventStub );

                var seekState = new SeekState( mediaWidget );
                seekState.seekTo( 10 );
            });

            queue.call("Assert", function (callbacks) {
                var event = bubbleEventStub.args[0][0];
                assertEquals( "seeking", event.type );
            });
        });
    };

    this.SeekStateTest.prototype.testSeekToSamePointDoesNotGeneratesSeeking = function (queue) {
        queuedRequire(queue, ["antie/devices/media/seekstate"], function( SeekState ) {
            var bubbleEventStub = sinon.stub();

            var mediaWidget = {};
            var seekState;

            queue.call("SeekTo1", function (callbacks) {
                mediaWidget.bubbleEvent = callbacks.add( bubbleEventStub );

                seekState = new SeekState( mediaWidget );
                seekState.seekTo( 10 );
                mediaWidget.bubbleEvent = bubbleEventStub;
                seekState.seekTo( 10 );
            });

            queue.call("Assert", function (callbacks) {
                var event = bubbleEventStub.args[0][0];
                assertEquals( "seeking", event.type );
                assertEquals( 1, bubbleEventStub.callCount );
            });
        });
    };

    this.SeekStateTest.prototype.testSeekThenPlayingGeneratesSeeked = function (queue) {
        queuedRequire(queue, ["antie/devices/media/seekstate"], function( SeekState ) {
            var bubbleEventStub = sinon.stub();

            var mediaWidget = {};
            var seekState;

            queue.call("SeekTo1", function (callbacks) {
                mediaWidget.bubbleEvent = bubbleEventStub;

                seekState = new SeekState( mediaWidget );
                seekState.seekTo( 10 );
                mediaWidget.bubbleEvent = callbacks.add( bubbleEventStub );
                seekState.playing();

            });

            queue.call("Assert", function (callbacks) {
                var event = bubbleEventStub.args[1][0];
                assertEquals( "seeked", event.type );
                assertEquals( 2, bubbleEventStub.callCount );
            });
        });
    };



})();
