"use client"
import Layout from "@/components/layout/Layout"
import styled from 'styled-components'
const dashboard = () => {
  return (
    <Layout>
        <DashboardTopLeft>

        </DashboardTopLeft>
        <FileManager>
            File Manager
        </FileManager>
        <VisitorCount>
            Visitor Count
        </VisitorCount>
    </Layout>
  )
}

export default dashboard

const DashboardTopLeft=styled.div`

`

const FileManager=styled.div`

`

const VisitorCount =styled.div`
`