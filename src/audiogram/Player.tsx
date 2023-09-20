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
  subtitles: string;
  backgroundImage: string;
  visualizeType: string;
}

export const AudiogramPlayer: FC<AudiogramPlayerProps> = ({
  audioOffsetInSeconds,
  audioFile,
  coverImage,
  titleText,
  subtitles,
  backgroundImage,
  visualizeType,
}) => {
  const {
    titleColor,
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

  const { durationInFrames, fps } = useVideoConfig();

  const [handle] = useState(() => delayRender());
  const [subtitlesText, setSubtitlesText] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(subtitles)
      .then((res) => res.text())
      .then((text) => {
        setSubtitlesText(text);
        continueRender(handle);
      })
      .catch((err) => {
        console.log("Error fetching subtitles", err);
      });
  }, [handle, subtitles]);

  if (!subtitlesText) {
    return null;
  }

  const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);

  return (
    <div>
      <Audio
        src={audioFile}
        startFrom={audioOffsetInFrames}
        endAt={audioOffsetInFrames + durationInFrames}
      />
      <Sequence from={-audioOffsetInFrames}>
        <div
          className="container"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="box arrow-bottom">
            <div
              style={{ lineHeight: `${subtitlesLineHeight}px` }}
              className="captions"
            >
              <PaginatedSubtitles
                subtitles={subtitlesText}
                startFrame={audioOffsetInFrames}
                endFrame={audioOffsetInFrames + durationInFrames}
                linesPerPage={subtitlesLinePerPage}
                subtitlesTextColor={subtitlesTextColor}
                subtitlesZoomMeasurerSize={subtitlesZoomMeasurerSize}
                subtitlesLineHeight={subtitlesLineHeight}
              />
            </div>

            <div>
              <AudioWave
                audioSrc={audioFile}
                mirrorWave={mirrorWave}
                waveColor={waveColor}
                numberOfSamples={Number(waveNumberOfSamples)}
                freqRangeStartIndex={waveFreqRangeStartIndex}
                waveLinesToDisplay={waveLinesToDisplay}
                visualizeType={visualizeType}
              />
            </div>
          </div>

          <div className="row">
            <Img className="cover" src={coverImage} />
            <div className="title" style={{ color: titleColor }}>
              {titleText}
            </div>
          </div>
        </div>
      </Sequence>
    </div>
  );
};
