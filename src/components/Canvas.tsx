import React, { forwardRef } from 'react';

type CanvasProps = {
    width: number;
    height: number;
}

const Canvas = forwardRef(function Canvas({ width, height }: CanvasProps, ref: React.ForwardedRef<HTMLCanvasElement>) {
    return (
        <div className='flex items-center justify-center w-[40rem] h-[30rem] border-2 border-solid border-black bg-blue-600 p-4 rounded'>
            <canvas className='rounded' ref={ref} id="canvas" width={width} height={height} />
        </div>
    )
});

export default Canvas