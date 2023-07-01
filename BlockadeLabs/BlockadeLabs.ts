import { BlockadeLabsSdk } from '@blockadelabs/sdk';

const sdk = new BlockadeLabsSdk({
  api_key: YOUR_API_KEY,
});

const generation = await sdk.generateImagine({
  generator: 'stable', // REQUIRED
  generator_data: {
    prompt: 'PROMPT_GOES_HERE', // REQUIRED
    ...others_generator_data, // Optional
  }, // REQUIRED
  webhook_url: 'YOUR_WEBHOOK_URL', // Optional
});

/* 
  The generateImagine method can accept different types of generator_data, which may include files.
  In this case, we've multiple ways of passing these files to the method.
  And this can change depending on your environment.

  # Node Environment

  In Node, you can pass these params as a string URL, as a Buffer, or as a Uint8Array

  # Browser Environment

  In a browser environment, you can pass these params as a string URL, as a Blob, or as a Uint8Array
*/

// init_image param node environment example
import * as fs from 'fs';
import { BlockadeLabsSdk } from '@blockadelabs/sdk';

const sdk = new BlockadeLabsSdk({
  api_key: YOUR_API_KEY,
});

const readFileAsBuffer = (filePath: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const buffer = await readFileAsBuffer('IMAGE_PATH HERE');

const generation = await sdk.generateImagine({
  generator: 'stable',
  generator_data: { prompt: 'PROMPT_GOES_HERE', init_image: buffer },
});

// init_image param browser environment example with React
import { useState, useCallback } from 'react';
import { BlockadeLabsSdk } from '@blockadelabs/sdk';

const fileToBlob = (file: File): Blob => {
  const blob = file.slice(0, file.size, file.type);

  return new Blob([blob], { type: file.type });
};

const sdk = new BlockadeLabsSdk({
  api_key: YOUR_API_KEY,
});

function Component() {
  const [file, setFile] = useState<File | null>(null);

  const generateSkybox = useCallback(async (file: File) => {
    const blob = fileToBlob(file);

    const generation = await sdk.generateImagine({
      generator: 'stable',
      generator_data: {
        prompt: 'PROMPT_GOES_HERE',
        init_image: blob,
      },
    });

    return generation;
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files && event.target.files[0];

      if (selectedFile) {
        setFile(selectedFile);
      }
    },
    [file],
  );

  return (
    <div className="App">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {file && <button onClick={() => generateSkybox(file)}>Generate</button>}
    </div>
  );
}

export default Component;