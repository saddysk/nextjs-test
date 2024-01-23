import { FC } from "react";
import { Composition, staticFile } from "remotion";
import { AudiogramComposition } from "./Composition";
import { AudiogramSchema } from "./Schema";

export const fps = 30;

const RemotionRoot: FC = () => {
  return (
    <>
      <Composition
        id="Audiogram"
        component={AudiogramComposition}
        fps={fps}
        width={1080}
        height={1920}
        schema={AudiogramSchema}
        defaultProps={{
          durationInSeconds: 0,
          audioOffsetInSeconds: 0,
          audioFile: "",
          coverImage: "",
          titleText: "",
          captionText: "",
          subtitles: "",
          backgroundImage: staticFile("audiogram/background.png"),
          visualizeType: "line",
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInSeconds * fps,
            props,
          };
        }}
      />
    </>
  );
};

export default RemotionRoot;
