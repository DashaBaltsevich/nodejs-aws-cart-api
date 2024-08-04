#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CartStackWithEB } from '../lib/cdk-stack';

const app = new cdk.App();
new CartStackWithEB(app, 'CartStackWithEB', {});
