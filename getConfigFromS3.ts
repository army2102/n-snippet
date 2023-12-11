import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

type ConfigFromS3 = {}

export const getConfigFromS3 = async ({
  bucketName,
  filePath
}: {
  bucketName: string
  filePath: string
}): Promise<ConfigFromS3> => {
  const s3Client = new S3Client({
    region: ''
  })

  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: filePath
    })
  )

  if (!response.Body) {
    throw new Error(
      `Cannot get config from S3, response.Body is ${typeof response.Body}`
    )
  }

  const fileString = await response.Body?.transformToString()
  const lines = fileString.split('\r\n')

  let rawConfig: Record<string, string> = {}
  for (const line of lines) {
    const equalIndex = line.indexOf('=')

    const key = line.slice(0, equalIndex).trim()
    const value = line.slice(equalIndex + 1).trim()

    rawConfig[key] = value
  }

  const config = {}

  return config
}
