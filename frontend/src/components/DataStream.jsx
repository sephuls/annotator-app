import { useEffect, useState } from 'react';
import httpClient from "../httpClient"

export function DataStream({dataStream}) {


    return (
        <div className='data-stream' style={{width: `${100/dataStream.id}%`}}>
            {dataStream.id}
        </div>
    );
}
