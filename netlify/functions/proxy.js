const fetch = require('node-fetch');

exports.handler = async function(event) {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };
  
  // OPTIONS 요청 처리 (preflight 요청)
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers, 
      body: '' 
    };
  }
  
  try {
    // 요청 데이터 준비
    let videoId;
    
    // GET 요청 파라미터 확인
    if (event.queryStringParameters && event.queryStringParameters.videoId) {
      videoId = event.queryStringParameters.videoId;
      console.log('GET 파라미터에서 videoId 추출:', videoId);
    } 
    // POST 요청 본문 확인
    else if (event.body) {
      try {
        const body = JSON.parse(event.body);
        videoId = body.videoId;
        console.log('POST 본문에서 videoId 추출:', videoId);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
      }
    }
    
    if (!videoId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'videoId 파라미터가 필요합니다' 
        })
      };
    }
    
    // Google Apps Script 웹 앱 URL (실제 배포 ID 사용)
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbzyeNOShZnxWqgN_QWauWdBMyAuNdcufjgqPoOQbXFaw7UBR4iAodMCSXuYLPrImSlK/exec';
    
    // Google Apps Script에 요청 전송
    console.log('Google Apps Script에 요청 전송:', `${appsScriptUrl}?videoId=${encodeURIComponent(videoId)}`);
    const response = await fetch(`${appsScriptUrl}?videoId=${encodeURIComponent(videoId)}`);
    
    // 응답 처리
    const data = await response.json();
    console.log('Google Apps Script 응답:', data);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('오류 발생:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message || '알 수 없는 오류가 발생했습니다' 
      })
    };
  }
};
