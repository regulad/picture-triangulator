import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import React, { type ReactNode } from "react";

export default function Page(): ReactNode {
  return (
    <Accordion>
      <AccordionPanel>
        <AccordionTitle>How does it work?</AccordionTitle>
        <AccordionContent>
          <p>
            This website uses the GPS and compass data embedded in most photos
            taken with smartphones along with some{" "}
            <a
              className="classic-link"
              href={"https://en.wikipedia.org/wiki/Geodesy"}
            >
              geodesy
            </a>{" "}
            to find the location of the subject of the photo.
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel>
        <AccordionTitle>How accurate is it?</AccordionTitle>
        <AccordionContent>
          <p>
            The accuracy of the location depends on the accuracy of the GPS data
            in the photo. The compass data is used to help determine the
            direction the camera was facing when the photo was taken.
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel>
        <AccordionTitle>What about privacy?</AccordionTitle>
        <AccordionContent>
          <p>
            No data is uploaded to any server. All processing is done in your
            browser. The photos are not saved or sent anywhere.
          </p>
          <p className={"mt-2"}>
            This website is open-source. You can view the source code on{" "}
            <a
              className="classic-link"
              href={"https://github.com/regulad/picture-triangulator"}
            >
              GitHub
            </a>
            .
          </p>
          <p className={"mt-2"}>
            This website uses Sentry and Vercel Analytics to track errors and
            usage. No personal data is collected.
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel>
        <AccordionTitle>
          None of my pictures seem to have GPS data.
        </AccordionTitle>
        <AccordionContent>
          <p>
            Some browsers (especially Chrome for Android) strip out the GPS data
            from photos when they are uploaded. Try using a different browser or
            a different device.
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel>
        <AccordionTitle>What are some applications of this?</AccordionTitle>
        <AccordionContent>
          <p>
            Perhaps this website can be used to help pinpoint the location of
            wildfires or other natural disasters in situations where it is not
            possible to use traditional GPS methods.
          </p>
          <p className={"mt-2"}>
            <a
              className={"classic-link"}
              href={
                "https://github.com/regulad/picture-triangulator/blob/69f2e1c63f1207781460875cb01461ac8cff6972/test/fire"
              }
            >
              Here are some demo pictures I took with my phone while driving in
              Florida,
            </a>{" "}
            you can see that even though I can{"'"}t access where the wildfire
            is I can still figure out it{"'"}s location.
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel>
        <AccordionTitle>
          What if I have a question that isn{"'"}t answered here?
        </AccordionTitle>
        <AccordionContent>
          <p>You can email me at regulad {`{at}`} regulad.xyz</p>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  );
}
