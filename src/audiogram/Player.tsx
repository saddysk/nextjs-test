import { FC, useEffect, useRef, useState } from "react";
import {
  Audio,
  Img,
  Sequence,
  continueRender,
  delayRender,
  useVideoConfig,
} from "remotion";
import { PaginatedSubtitles } from "./Subtitles";
import { AudioWave } from "./AudioWave";
import { constants } from "./const";

interface AudiogramPlayerProps {
  audioOffsetInSeconds: number;
  audioFile: string;
  coverImage: string;
  titleText: string;
  subtitlesUrl: string;
  backgroundColor: string;
}

export const AudiogramPlayer: FC<AudiogramPlayerProps> = ({
  audioOffsetInSeconds,
  audioFile,
  coverImage,
  titleText,
  subtitlesUrl,
  backgroundColor,
}) => {
  const {
    titleColor,
    onlyDisplayCurrentSentence,
    subtitlesTextColor,
    subtitlesLinePerPage,
    subtitlesLineHeight,
    subtitlesZoomMeasurerSize,
    waveColor,
    waveLinesToDisplay,
    waveFreqRangeStartIndex,
    waveNumberOfSamples,
    mirrorWave,
  } = constants;

  const ref = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender());
  const [subtitles, setSubtitles] = useState<string | null>(null);
  const { durationInFrames, fps } = useVideoConfig();

  useEffect(() => {
    fetch(subtitlesUrl)
      .then((res) => res.text())
      .then((text) => {
        setSubtitles(text);
        continueRender(handle);
      })
      .catch((err) => {
        console.log("Error fetching subtitles", err);
      });
  }, [handle, subtitlesUrl]);

  if (!subtitles) {
    return null;
  }

  const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);

  return (
    <div ref={ref}>
      <Audio
        src={audioFile}
        startFrom={audioOffsetInFrames}
        endAt={audioOffsetInFrames + durationInFrames}
      />
      <Sequence from={-audioOffsetInFrames}>
        <div
          className="container"
          style={{ backgroundColor: backgroundColor, fontFamily: "DM Sans" }}
        >
          <div className="title" style={{ color: titleColor }}>
            {titleText}
          </div>

          <div className="row">
            <div className="coverContainer">
              <Img className="cover" src={coverImage} />
            </div>
            <AudioWave
              audioSrc={audioFile}
              mirrorWave={mirrorWave}
              waveColor={waveColor}
              numberOfSamples={Number(waveNumberOfSamples)}
              freqRangeStartIndex={waveFreqRangeStartIndex}
              waveLinesToDisplay={waveLinesToDisplay}
            />
          </div>

          <div
            style={{ lineHeight: `${subtitlesLineHeight}px` }}
            className="captions"
          >
            <PaginatedSubtitles
              subtitles={subtitles}
              startFrame={audioOffsetInFrames}
              endFrame={audioOffsetInFrames + durationInFrames}
              linesPerPage={subtitlesLinePerPage}
              subtitlesTextColor={subtitlesTextColor}
              subtitlesZoomMeasurerSize={subtitlesZoomMeasurerSize}
              subtitlesLineHeight={subtitlesLineHeight}
              onlyDisplayCurrentSentence={onlyDisplayCurrentSentence}
            />
          </div>
        </div>
      </Sequence>
    </div>
  );
};
