#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CartStack } from '../lib/cdk-stack';

const app = new cdk.App();
new CartStack(app, 'CartStack', {});
